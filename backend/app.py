from flask import Flask, request, jsonify
from pydantic import BaseModel, EmailStr, ValidationError, PositiveFloat, conint
import logging
import json # Added import
import os # For checking file existence

app = Flask(__name__)

# Configure basic logging
logging.basicConfig(level=logging.INFO)

# --- Data Persistence Setup ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Get current directory
VENDORS_FILE = os.path.join(BASE_DIR, 'vendors_db.json')
PRODUCTS_FILE = os.path.join(BASE_DIR, 'products_db.json')
CART_FILE = os.path.join(BASE_DIR, 'cart_db.json')

# In-memory databases - will be populated by load_data()
vendors_db = []
next_vendor_id = 1

products_db = []
next_product_id = 1

cart_items_db = []
# next_cart_item_id is not used as cart items don't have their own independent ID

def _load_single_db(filepath, default_data=None):
    if default_data is None:
        default_data = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                app.logger.info(f"Successfully loaded data from {filepath}")
                return data
        except (json.JSONDecodeError, IOError) as e:
            app.logger.warning(f"Error loading data from {filepath}: {e}. Initializing with empty list.")
            return default_data
    else:
        app.logger.info(f"{filepath} not found. Initializing with empty list.")
        return default_data

def load_data():
    global vendors_db, next_vendor_id
    global products_db, next_product_id
    global cart_items_db

    vendors_db[:] = _load_single_db(VENDORS_FILE)
    if vendors_db:
        next_vendor_id = max(v.get('id', 0) for v in vendors_db) + 1
    else:
        next_vendor_id = 1
    app.logger.info(f"Vendors DB loaded. Next vendor ID: {next_vendor_id}")

    products_db[:] = _load_single_db(PRODUCTS_FILE)
    if products_db:
        next_product_id = max(p.get('product_id', 0) for p in products_db) + 1
    else:
        next_product_id = 1
    app.logger.info(f"Products DB loaded. Next product ID: {next_product_id}")

    cart_items_db[:] = _load_single_db(CART_FILE)
    app.logger.info(f"Cart DB loaded. {len(cart_items_db)} items in cart.")


def _save_single_db(filepath, data):
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
        app.logger.info(f"Successfully saved data to {filepath}")
    except IOError as e:
        app.logger.error(f"Error saving data to {filepath}: {e}", exc_info=True)

def save_all_data():
    """Saves all databases to their respective files."""
    _save_single_db(VENDORS_FILE, vendors_db)
    _save_single_db(PRODUCTS_FILE, products_db)
    _save_single_db(CART_FILE, cart_items_db)

# --- Pydantic Models ---
class VendorSignupModel(BaseModel):
    shopName: str
    email: EmailStr
    password: str
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

# --- Helper Functions ---
def _get_product_by_id(product_id: int):
    return next((p for p in products_db if p.get("product_id") == product_id), None)

def _get_cart_item_by_product_id(product_id: int):
    return next((item for item in cart_items_db if item.get("product_id") == product_id), None)

# --- Error Handlers ---
@app.errorhandler(ValidationError)
def handle_validation_error(e):
    app.logger.warning(f"Validation Error: {e.errors()}")
    return jsonify({"error": "Validation failed", "details": e.errors()}), 400

@app.errorhandler(Exception)
def handle_generic_exception(e):
    app.logger.error(f"Unhandled Exception: {e}", exc_info=True)
    return jsonify({"error": "An unexpected server error occurred. Please try again later."}), 500

# --- Request Logging ---
@app.after_request
def log_request_info(response):
    app.logger.info(
        f'{request.remote_addr} - "{request.method} {request.path} HTTP/{request.environ.get("SERVER_PROTOCOL","1.1")}" {response.status_code}'
    ) # Removed content_length as it might not always be available or accurate here
    return response

# --- Routes ---
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/auth/vendor-signup', methods=['POST'])
def vendor_signup():
    global next_vendor_id
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    vendor_data_model = VendorSignupModel(**data)

    new_vendor = vendor_data_model.model_dump()
    new_vendor["id"] = next_vendor_id
    vendors_db.append(new_vendor)
    app.logger.info(f"New vendor registered: {new_vendor['shopName']} (ID: {next_vendor_id})")
    next_vendor_id += 1
    save_all_data() # Save after modification
    return jsonify({"message": "Vendor registered successfully", "vendor_id": new_vendor["id"]}), 201

@app.route('/api/products', methods=['GET'])
def get_all_products():
    return jsonify(products_db)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = _get_product_by_id(product_id)
    if product:
        return jsonify(product)
    else:
        app.logger.info(f"Product with ID {product_id} not found.")
        return jsonify({"error": "Product not found"}), 404

@app.route('/api/products', methods=['POST'])
def add_product():
    global next_product_id
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    product_data_model = ItemSubmissionModel(**data)

    new_product = product_data_model.model_dump()
    new_product["product_id"] = next_product_id
    products_db.append(new_product)
    app.logger.info(f"New product added: {new_product['itemName']} (ID: {next_product_id})")
    next_product_id += 1
    save_all_data() # Save after modification
    return jsonify({"message": "Product added successfully", "product_id": new_product["product_id"]}), 201

# --- Cart Endpoints ---
@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify(cart_items_db)

@app.route('/api/cart/items', methods=['POST'])
def add_or_update_cart_item():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    cart_item_data = CartItemAdd(**data)

    product = _get_product_by_id(cart_item_data.product_id)
    if not product:
        app.logger.info(f"Attempt to add non-existent product ID {cart_item_data.product_id} to cart.")
        return jsonify({"error": f"Product with ID {cart_item_data.product_id} not found"}), 404

    existing_item = _get_cart_item_by_product_id(cart_item_data.product_id)
    if existing_item:
        existing_item["quantity"] += cart_item_data.quantity
        app.logger.info(f"Updated quantity for product ID {cart_item_data.product_id} in cart. New q: {existing_item['quantity']}")
    else:
        new_cart_item = {
            "product_id": product["product_id"],
            "itemName": product["itemName"],
            "price": product["price"],
            "quantity": cart_item_data.quantity
        }
        cart_items_db.append(new_cart_item)
        app.logger.info(f"Added new product ID {cart_item_data.product_id} to cart with q: {cart_item_data.quantity}")

    save_all_data() # Save after modification
    return jsonify({"message": "Item added/updated in cart", "cart": cart_items_db}), 200

@app.route('/api/cart/items/<int:product_id>', methods=['PUT'])
def update_cart_item_quantity(product_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400
    update_data = CartItemUpdate(**data)

    cart_item = _get_cart_item_by_product_id(product_id)
    if not cart_item:
        app.logger.info(f"Attempt to update non-existent item ID {product_id} in cart.")
        return jsonify({"error": f"Item with product ID {product_id} not found in cart"}), 404

    if update_data.quantity <= 0:
        cart_items_db.remove(cart_item)
        app.logger.info(f"Removed item ID {product_id} from cart (q <= 0).")
    else:
        cart_item["quantity"] = update_data.quantity
        app.logger.info(f"Updated quantity for item ID {product_id} in cart to {update_data.quantity}.")

    save_all_data() # Save after modification
    return jsonify({"message": f"Item {product_id} quantity updated/removed", "cart": cart_items_db}), 200

@app.route('/api/cart/items/<int:product_id>', methods=['DELETE'])
def remove_cart_item(product_id):
    global cart_items_db
    original_len = len(cart_items_db)
    cart_items_db = [item for item in cart_items_db if item.get("product_id") != product_id]

    if len(cart_items_db) == original_len:
        app.logger.info(f"Attempt to delete non-existent item ID {product_id} from cart.")
        return jsonify({"error": f"Item with product ID {product_id} not found in cart"}), 404

    app.logger.info(f"Removed item ID {product_id} from cart.")
    save_all_data() # Save after modification
    return jsonify({"message": f"Item {product_id} removed from cart", "cart": cart_items_db}), 200

@app.route('/api/cart', methods=['DELETE'])
def clear_cart():
    global cart_items_db
    cart_items_db = []
    app.logger.info("Cart cleared.")
    save_all_data() # Save after modification
    return jsonify({"message": "Cart cleared successfully", "cart": cart_items_db}), 200

# --- Search Endpoint ---
@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get('q')

    if not query:
        return jsonify({"error": "Search query 'q' parameter is required"}), 400

    query_lower = query.lower()
    search_results = []
    app.logger.info(f"Search performed for query: '{query}'")

    for product in products_db:
        item_name = product.get("itemName", "")
        description = product.get("description", "")

        if query_lower in item_name.lower() or query_lower in description.lower():
            search_results.append(product)

    return jsonify(search_results)

if __name__ == '__main__':
    load_data() # Load data on startup
    app.run(debug=True)
