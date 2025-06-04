# HeyvanKala Backend API Documentation

This document provides details for all the available API endpoints for the HeyvanKala backend application.

## Database Setup (MySQL)

This backend now uses MySQL as its database via SQLAlchemy. Before running, ensure you have:

1.  A MySQL server instance running.
2.  Connection details (host, port, user, password, database name) configured via the following environment variables:
    *   `DB_HOST` (defaults to `localhost`)
    *   `DB_PORT` (defaults to `3306`)
    *   `DB_USER` (defaults to `petshop_user`)
    *   `DB_PASSWORD` (defaults to `petshop_password`)
    *   `DB_NAME` (defaults to `petshop_db`)
3.  The database specified by `DB_NAME` must be created on your MySQL server.
4.  The user specified by `DB_USER` must have permissions to connect to the database and perform CRUD operations, as well as create/drop tables.
5.  Once the environment variables are set and the database exists, run the following command from the project root (with your virtual environment active if you use one for the backend) to create the necessary tables:
    ```bash
    flask --app backend/app.py init-db
    ```

## Dependencies

Key Python dependencies for this backend (managed in `requirements.txt`) include:
*   Flask
*   Pydantic (for request validation)
*   SQLAlchemy (for database ORM)
*   mysql-connector-python (MySQL driver for SQLAlchemy)
*   Werkzeug (for password hashing, a Flask dependency)

General Notes:
*   All request and response bodies are in JSON format.
*   The base URL for these endpoints is assumed to be `/api`.
*   Successful write operations (POST, PUT, DELETE) that modify a resource collection often return the updated collection.

---

## Authentication

---

### `POST /api/auth/vendor-signup`

*   **Description**: Registers a new vendor in the system. Passwords are automatically hashed before storage.
*   **Request Body**:
    ```json
    {
      "shopName": "string",      // Name of the vendor's shop
      "email": "string",         // Valid email address for the vendor
      "password": "string",      // Password for the vendor account (min 8 characters advised by frontend)
      "contactPerson": "string", // Name of the contact person for the vendor
      "phoneNumber": "string",   // Vendor's phone number
      "shopAddress": "string"    // Physical address of the vendor's shop
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "message": "Vendor registered successfully",
      "vendor_id": 1 // The ID of the newly registered vendor
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request` (Validation Error or No data provided):
        ```json
        {
          "error": "Validation failed",
          "details": [ // Example: pydantic.ValidationError format
            {
              "loc": ["email"],
              "msg": "value is not a valid email address",
              "type": "value_error.email"
            }
          ]
        }
        ```
        ```json
        {
          "error": "No data provided"
        }
        ```
    *   `409 Conflict` (e.g., if email already exists):
        ```json
        {
            "error": "This email is already registered."
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

## Products

---

### `POST /api/products`

*   **Description**: Adds a new product to the store.
*   **Request Body**:
    ```json
    {
      "itemName": "string",     // Name of the product
      "description": "string",  // Detailed description of the product
      "price": "number",        // Price of the product (must be positive)
      "category": "string"      // Category of the product (e.g., "dog", "cat")
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "message": "Product added successfully",
      "product_id": 1 // The ID of the newly added product
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request` (Validation Error or No data provided):
        ```json
        {
          "error": "Validation failed",
          "details": [
            {
              "loc": ["price"],
              "msg": "ensure this value is greater than 0",
              "type": "value_error.number.not_gt",
              "ctx": {"limit_value": 0}
            }
          ]
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

### `GET /api/products`

*   **Description**: Retrieves a list of all available products.
*   **Request Body**: None.
*   **Success Response (200 OK)**:
    ```json
    [
      {
        "id": 1,
        "itemName": "Premium Dog Food",
        "description": "High-quality dry food for adult dogs.",
        "price": 25.99,
        "category": "dog"
      },
      {
        "id": 2,
        "itemName": "Interactive Cat Toy",
        "description": "Feather wand to engage your cat.",
        "price": 9.50,
        "category": "cat"
      }
    ]
    ```
    (Returns an empty list `[]` if no products are available. Note: `id` is used here for consistency with DB model, previously was `product_id` in some examples).
*   **Error Responses**:
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

### `GET /api/products/<product_id>`

*   **Description**: Retrieves details for a specific product by its ID.
*   **Request Body**: None.
*   **URL Parameters**:
    *   `product_id` (integer): The ID of the product to retrieve.
*   **Success Response (200 OK)**:
    ```json
    {
      "id": 1,
      "itemName": "Premium Dog Food",
      "description": "High-quality dry food for adult dogs.",
      "price": 25.99,
      "category": "dog"
    }
    ```
     (Note: `id` is used here for consistency with DB model).
*   **Error Responses**:
    *   `404 Not Found`:
        ```json
        {
          "error": "Product not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

## Cart

---

### `POST /api/cart/items`

*   **Description**: Adds a product to the cart or updates its quantity if it already exists.
*   **Request Body**:
    ```json
    {
      "product_id": "integer", // ID of the product to add
      "quantity": "integer"    // Quantity to add (must be > 0)
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "Item added/updated in cart",
      "cart": [ // The updated list of all items in the cart
        {
          "id": 1, // CartItem ID
          "product_id": 1,
          "itemName": "Premium Dog Food",
          "price": 25.99,
          "quantity": 2
        }
      ]
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request` (Validation Error or No data provided):
        ```json
        {
          "error": "Validation failed",
          "details": [
            {
                "loc": ["quantity"],
                "msg": "ensure this value is greater than 0",
                "type": "value_error.number.not_gt",
                "ctx": {"limit_value": 0}
            }
          ]
        }
        ```
    *   `404 Not Found` (If `product_id` does not exist):
        ```json
        {
          "error": "Product with ID 123 not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

### `GET /api/cart`

*   **Description**: Retrieves all items currently in the shopping cart.
*   **Request Body**: None.
*   **Success Response (200 OK)**:
    ```json
    [
      {
        "id": 1, // CartItem ID
        "product_id": 1,
        "itemName": "Premium Dog Food",
        "price": 25.99,
        "quantity": 2
      },
      {
        "id": 2, // CartItem ID
        "product_id": 2,
        "itemName": "Interactive Cat Toy",
        "price": 9.50,
        "quantity": 1
      }
    ]
    ```
    (Returns an empty list `[]` if the cart is empty.)
*   **Error Responses**:
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

### `PUT /api/cart/items/<product_id>`

*   **Description**: Updates the quantity of a specific item in the cart. If quantity is set to 0 or less, the item is removed from the cart.
*   **Request Body**:
    ```json
    {
      "quantity": "integer" // New quantity (must be >= 0). If 0, item is removed.
    }
    ```
*   **URL Parameters**:
    *   `product_id` (integer): The ID of the product (not CartItem ID) in the cart to update.
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "Item 1 quantity updated/removed", // Message might vary
      "cart": [ // The updated list of all items in the cart
        {
          "id": 2, // CartItem ID
          "product_id": 2,
          "itemName": "Interactive Cat Toy",
          "price": 9.50,
          "quantity": 1
        }
      ]
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request` (Validation Error or No data provided):
        ```json
        {
          "error": "Validation failed for request body",
          "details": [
            {
                "loc": ["quantity"],
                "msg": "ensure this value is greater than or equal to 0",
                "type": "value_error.number.not_ge",
                "ctx": {"limit_value": 0}
            }
          ]
        }
        ```
    *   `404 Not Found` (If item with `product_id` is not in the cart):
        ```json
        {
          "error": "Item with product ID 123 not found in cart"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

### `DELETE /api/cart/items/<product_id>`

*   **Description**: Removes a specific item from the shopping cart, identified by its product ID.
*   **Request Body**: None.
*   **URL Parameters**:
    *   `product_id` (integer): The ID of the product to remove from the cart.
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "Item 1 removed from cart",
      "cart": [ // The updated list of all items in the cart
        {
          "id": 2, // CartItem ID
          "product_id": 2,
          "itemName": "Interactive Cat Toy",
          "price": 9.50,
          "quantity": 1
        }
      ]
    }
    ```
*   **Error Responses**:
    *   `404 Not Found` (If item with `product_id` is not in the cart):
        ```json
        {
          "error": "Item with product ID 123 not found in cart"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

### `DELETE /api/cart`

*   **Description**: Clears all items from the shopping cart.
*   **Request Body**: None.
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "Cart cleared successfully",
      "cart": [] // Cart is now empty
    }
    ```
*   **Error Responses**:
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---

## Search

---

### `GET /api/search`

*   **Description**: Searches for products based on a query string. The search is case-insensitive and checks against product item names and descriptions.
*   **Request Body**: None.
*   **Query Parameters**:
    *   `q` (string): The search query.
*   **Success Response (200 OK)**:
    ```json
    [ // List of matching products. Same format as GET /api/products
      {
        "id": 1,
        "itemName": "Premium Dog Food",
        "description": "High-quality dry food for adult dogs, contains chicken.",
        "price": 25.99,
        "category": "dog"
      }
    ]
    ```
    (Returns an empty list `[]` if no products match the query. Note: `id` is used here for consistency with DB model).
*   **Error Responses**:
    *   `400 Bad Request` (If `q` parameter is missing):
        ```json
        {
          "error": "Search query 'q' parameter is required"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "An unexpected server error occurred. Please try again later."
        }
        ```

---
```
