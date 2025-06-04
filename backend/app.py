from flask import Flask, request, jsonify
from pydantic import BaseModel, EmailStr, ValidationError, PositiveFloat, conint, Field
from typing import List, Optional # For Pydantic response models if used later
import logging
# import json # No longer needed for primary data storage
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash # Import for password hashing

# Retrieve DB connection details from environment variables
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '3306')
DB_USER = os.environ.get('DB_USER', 'petshop_user')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'petshop_password')
DB_NAME = os.environ.get('DB_NAME', 'petshop_db')

# Construct the SQLAlchemy Database URI
DATABASE_URI = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

app = Flask(__name__)

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Suppress a warning

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# --- SQLAlchemy Models ---
class Vendor(db.Model):
    __tablename__ = 'vendors'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shopName = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False) # Will address hashing in a later step
    contactPerson = db.Column(db.String(120), nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    shopAddress = db.Column(db.Text, nullable=False)

    def set_password(self, password_text):
        self.password = generate_password_hash(password_text)

    def check_password(self, password_text):
        return check_password_hash(self.password, password_text)

    def __repr__(self):
        return f'<Vendor {self.shopName}>'

    # Future login route should use vendor.check_password(submitted_password)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    itemName = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    # Optional: Add vendor_id as a foreign key if products are linked to vendors
    # vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=True)

    def __repr__(self):
        return f'<Product {self.itemName}>'

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Define relationship to Product model for easier access to product details
    product = db.relationship('Product', backref=db.backref('cart_items', lazy=True))

    def __repr__(self):
        return f'<CartItem product_id={self.product_id} quantity={self.quantity}>'

# Configure basic logging
logging.basicConfig(level=logging.INFO)

# --- Data Persistence Setup (JSON file-based, will be replaced or augmented by DB) ---
# Removed JSON file loading/saving logic and global lists (vendors_db, products_db, cart_items_db)
# Removed next_vendor_id, next_product_id global variables.

# --- Pydantic Models (for request validation - these remain) ---
class VendorSignupModel(BaseModel):
    shopName: str
    email: EmailStr
    password: str # Consider adding password confirmation if desired for validation
    contactPerson: str
    phoneNumber: str
    shopAddress: str

class ItemSubmissionModel(BaseModel):
    itemName: str
    description: str
    price: PositiveFloat
    category: str

class CartItemAdd(BaseModel):
    product_id: int
    quantity: conint(gt=0)

class CartItemUpdate(BaseModel):
    quantity: conint(ge=0)

# --- Helper Functions (current in-memory versions) ---
# Removed _get_product_by_id and _get_cart_item_by_product_id as DB queries will replace them.

# --- Error Handlers ---
@app.errorhandler(ValidationError)
def handle_validation_error(e: ValidationError): # Type hint for clarity
    app.logger.warning(f"Pydantic Validation Error: {e.errors()}")
    return jsonify({"error": "Validation failed", "details": e.errors()}), 400

@app.errorhandler(IntegrityError)
def handle_database_integrity_error(e: IntegrityError): # Type hint
    app.logger.error(f"Database Integrity Error: {e}", exc_info=True)
    db.session.rollback() # Rollback the session to a clean state
    # You might want to inspect e.orig to customize the message, e.g., for unique constraint
    return jsonify({"error": "Database conflict. A record with this information may already exist."}), 409

@app.errorhandler(Exception)
def handle_generic_exception(e: Exception): # Type hint
    app.logger.error(f"Unhandled Exception: {e}", exc_info=True)
    # It's good practice to rollback the session in case of any unhandled DB error
    # However, this might interfere if the error is not DB related or session is not active.
    # Consider if db.session.is_active before rollback, or if the error is specific to DB operations.
    # For now, let's keep it simple.
    return jsonify({"error": "An unexpected server error occurred. Please try again later."}), 500

# --- Request Logging ---
@app.after_request
def log_request_info(response):
    app.logger.info(
        f'{request.remote_addr} - "{request.method} {request.path} HTTP/{request.environ.get("SERVER_PROTOCOL","1.1")}" {response.status_code}'
    )
    return response

# --- Routes (to be updated for DB interaction) ---
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/auth/vendor-signup', methods=['POST'])
def vendor_signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Pydantic validation will be caught by the global error handler
    validated_data = VendorSignupModel(**data)

    new_vendor = Vendor(
        shopName=validated_data.shopName,
        email=validated_data.email,
        # password is set using set_password method below
        contactPerson=validated_data.contactPerson,
        phoneNumber=validated_data.phoneNumber,
        shopAddress=validated_data.shopAddress
    )
    new_vendor.set_password(validated_data.password) # Hash the password

    try:
        db.session.add(new_vendor)
        db.session.commit()
        app.logger.info(f"New vendor registered: {new_vendor.shopName} (ID: {new_vendor.id})")
        return jsonify({"message": "Vendor registered successfully", "vendor_id": new_vendor.id}), 201
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Failed to register vendor due to integrity error: {e}", exc_info=True)
        # Check if it's a unique constraint violation (e.g., email)
        if "Duplicate entry" in str(e.orig) and "vendors.email" in str(e.orig):
             return jsonify({"error": "This email is already registered."}), 409
        return jsonify({"error": "Database conflict. Could not register vendor."}), 409


@app.route('/api/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    products_list = [
        {
            "id": p.id, "itemName": p.itemName, "description": p.description,
            "price": p.price, "category": p.category
        } for p in products
    ]
    return jsonify(products_list)

@app.route('/api/products/<int:product_id_param>', methods=['GET']) # Renamed param to avoid conflict with model field
def get_product(product_id_param: int):
    product = db.session.get(Product, product_id_param) # More direct way to get by PK
    if not product:
        app.logger.info(f"Product with ID {product_id_param} not found.")
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": product.id, "itemName": product.itemName, "description": product.description,
        "price": product.price, "category": product.category
    })

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    validated_data = ItemSubmissionModel(**data)

    new_product = Product(
        itemName=validated_data.itemName,
        description=validated_data.description,
        price=validated_data.price,
        category=validated_data.category
    )

    db.session.add(new_product)
    db.session.commit()
    app.logger.info(f"New product added: {new_product.itemName} (ID: {new_product.id})")
    return jsonify({"message": "Product added successfully", "product_id": new_product.id}), 201

# --- Cart Endpoints ---
def _serialize_cart_item(cart_item: CartItem):
    return {
        "id": cart_item.id, # CartItem's own ID
        "product_id": cart_item.product_id,
        "itemName": cart_item.product.itemName, # Accessing via relationship
        "price": cart_item.product.price,     # Accessing via relationship
        "quantity": cart_item.quantity
    }

@app.route('/api/cart', methods=['GET'])
def get_cart():
    cart_items = CartItem.query.all()
    return jsonify([_serialize_cart_item(ci) for ci in cart_items])

@app.route('/api/cart/items', methods=['POST'])
def add_or_update_cart_item():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    validated_data = CartItemAdd(**data)

    # Check if product exists
    product = db.session.get(Product, validated_data.product_id)
    if not product:
        app.logger.info(f"Attempt to add non-existent product ID {validated_data.product_id} to cart.")
        return jsonify({"error": f"Product with ID {validated_data.product_id} not found"}), 404

    existing_item = CartItem.query.filter_by(product_id=validated_data.product_id).first()

    if existing_item:
        existing_item.quantity += validated_data.quantity
        app.logger.info(f"Updated quantity for product ID {validated_data.product_id} in cart. New q: {existing_item.quantity}")
    else:
        new_cart_item_db = CartItem(product_id=validated_data.product_id, quantity=validated_data.quantity)
        db.session.add(new_cart_item_db)
        app.logger.info(f"Added new product ID {validated_data.product_id} to cart with q: {validated_data.quantity}")

    db.session.commit()

    # Return the updated cart state
    all_cart_items = CartItem.query.all()
    return jsonify({"message": "Item added/updated in cart", "cart": [_serialize_cart_item(ci) for ci in all_cart_items]}), 200

@app.route('/api/cart/items/<int:product_id_param>', methods=['PUT']) # Renamed param
def update_cart_item_quantity(product_id_param: int):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    validated_data = CartItemUpdate(**data)

    cart_item = CartItem.query.filter_by(product_id=product_id_param).first()
    if not cart_item:
        app.logger.info(f"Attempt to update item with product ID {product_id_param}, not found in cart.")
        return jsonify({"error": f"Item with product ID {product_id_param} not found in cart"}), 404

    if validated_data.quantity <= 0:
        db.session.delete(cart_item)
        app.logger.info(f"Removed item with product ID {product_id_param} from cart (q <= 0).")
    else:
        cart_item.quantity = validated_data.quantity
        app.logger.info(f"Updated quantity for item with product ID {product_id_param} in cart to {validated_data.quantity}.")

    db.session.commit()
    all_cart_items = CartItem.query.all()
    return jsonify({"message": f"Item {product_id_param} quantity updated/removed", "cart": [_serialize_cart_item(ci) for ci in all_cart_items]}), 200

@app.route('/api/cart/items/<int:product_id_param>', methods=['DELETE']) # Renamed param
def remove_cart_item(product_id_param: int):
    cart_item = CartItem.query.filter_by(product_id=product_id_param).first()
    if not cart_item:
        app.logger.info(f"Attempt to delete item with product ID {product_id_param}, not found in cart.")
        return jsonify({"error": f"Item with product ID {product_id_param} not found in cart"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    app.logger.info(f"Removed item with product ID {product_id_param} from cart.")

    all_cart_items = CartItem.query.all()
    return jsonify({"message": f"Item {product_id_param} removed from cart", "cart": [_serialize_cart_item(ci) for ci in all_cart_items]}), 200

@app.route('/api/cart', methods=['DELETE'])
def clear_cart():
    try:
        num_rows_deleted = CartItem.query.delete()
        db.session.commit()
        app.logger.info(f"Cart cleared. {num_rows_deleted} items deleted.")
        return jsonify({"message": "Cart cleared successfully", "cart": []}), 200
    except Exception as e: # Catch potential errors during bulk delete
        db.session.rollback()
        app.logger.error(f"Error clearing cart: {e}", exc_info=True)
        return jsonify({"error": "Failed to clear cart due to a server error."}), 500


# --- Search Endpoint ---
@app.route('/api/search', methods=['GET'])
def search_products():
    query_param = request.args.get('q') # Renamed to avoid conflict

    if not query_param:
        return jsonify({"error": "Search query 'q' parameter is required"}), 400

    search_term = f"%{query_param.lower()}%" # Prepare for LIKE query

    # Using or_ from sqlalchemy for OR conditions
    # Using Product.itemName.ilike for case-insensitive search
    products = Product.query.filter(
        or_(
            Product.itemName.ilike(search_term),
            Product.description.ilike(search_term)
        )
    ).all()

    app.logger.info(f"Search performed for query: '{query_param}'. Found {len(products)} results.")

    products_list = [
        {
            "id": p.id, "itemName": p.itemName, "description": p.description,
            "price": p.price, "category": p.category
        } for p in products
    ]
    return jsonify(products_list)

# --- CLI Commands ---
@app.cli.command('init-db')
def init_db_command():
    """Clears existing data and creates new tables based on SQLAlchemy models."""
    with app.app_context():
        app.logger.info("Dropping all existing database tables...")
        db.drop_all()  # Clears all existing tables first
        app.logger.info("Creating all database tables based on models...")
        db.create_all()
    print('Initialized the database and created all tables.')

# To run this command, execute from your terminal (ensure backend venv is active if used):
# export FLASK_APP=backend/app.py  (or set FLASK_APP=backend\\app.py on Windows)
# flask init-db

if __name__ == '__main__':

# To run this command, execute from your terminal (ensure backend venv is active if used):
# export FLASK_APP=backend/app.py  (or set FLASK_APP=backend\\app.py on Windows)
# flask init-db

if __name__ == '__main__':
    # load_data() # JSON file loading is removed
    # Note: db.create_all() is handled by 'flask init-db' CLI command.
    # It's not typically run on every app start in production.
    app.run(debug=True)
