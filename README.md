# Product Inventory Management System

A full-stack Product Inventory Management System built for the Revest Solutions Full Stack Intern assignment.

The application allows a store manager to manage products, track stock levels, identify low-stock products, perform stock adjustments, and view stock movement history through a simple web interface.

## Assignment Requirements

This system implements the following requirements:

- Product CRUD APIs
- Product search by name or SKU
- Product filtering by category
- Product CRUD user interface
- Product validation
- Stock IN and Stock OUT operations
- Stock validation to prevent negative inventory
- Stock transaction history
- Low-stock status
- SQL schema and seed data for at least 10 products
- Postman API collection
- Full Git commit history

## Tech Stack

**Frontend:** React.js, Vite, JavaScript, CSS

**Backend:** Node.js, Express.js, REST APIs, MySQL2, dotenv, CORS

**Database:** MySQL

**API Testing:** Postman

## Project Structure

```text
productInventorySystem/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── database/
│   └── inventory.sql
│
├── postman/
│   └── product-inventory-api.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js
- npm
- MySQL
- Git
- Postman (for API testing)

## Database Setup

The repository contains the database setup file at `database/inventory.sql`, which creates the database, tables, and seed data.

**Database name:** `inventory_db`

**Tables:** `products`, `stock_transactions`

The SQL file includes seed data for 10 products.

### Create the Database

From the project root:

```bash
mysql -u root -p < database/inventory.sql
```

Enter your MySQL password when prompted. This creates a fresh `inventory_db` database with the required tables and sample products.

### Verify the Database

```bash
mysql -u root -p
```

```sql
USE inventory_db;
SHOW TABLES;
```

Expected output:

```text
products
stock_transactions
```

To confirm seed data loaded correctly:

```sql
SELECT * FROM products;
```

## Backend Setup

```bash
cd backend
npm install
```

### Environment Configuration

Copy the example environment file and fill in your local values:

```bash
cp .env.example .env
```

`.env`:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_db
DB_PORT=3306
```

Replace `your_mysql_password` with your local MySQL password.

> **Do not commit the `.env` file.** It contains local credentials. Only `.env.example` (with placeholder values) should be tracked in Git. This is already enforced by `backend/.gitignore`.

### Start the Backend

```bash
npm run dev
```

The backend runs on `http://localhost:5000`. The root endpoint can be checked directly at that URL.

## Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

Vite will print the local frontend URL in the terminal — typically `http://localhost:5173`. Open that URL in a browser.

> `npm start` runs the Vite dev server (aliased in `package.json` alongside the default `npm run dev`), so the app comes up with the standard `npm install && npm start` flow.

## Product CRUD APIs

### Create Product

```http
POST /api/products
```

```json
{
    "name": "Webcam",
    "sku": "WEB001",
    "category": "Electronics",
    "price": 3500,
    "quantity": 10,
    "low_stock_threshold": 3
}
```

### Get All Products

```http
GET /api/products
```

Supports search by product name/SKU and filtering by category (see below).

### Search Products

```http
GET /api/products?search=Lap
```

The search value can match the product name or SKU.

### Filter by Category

```http
GET /api/products?category=Electronics
```

### Get Product by ID

```http
GET /api/products/:id
```

Example: `GET /api/products/1`

### Update Product

```http
PUT /api/products/:id
```

```json
{
    "name": "Updated Laptop",
    "category": "Electronics",
    "price": 58000,
    "quantity": 12,
    "low_stock_threshold": 3
}
```

The SKU is not changed during an update — it is immutable after product creation.

### Delete Product

```http
DELETE /api/products/:id
```

Example: `DELETE /api/products/10`

## Product Validation

The backend validates product data before creating or updating products.

**Required fields:** Name, SKU, Category, Price, Quantity, Low Stock Threshold

**SKU validation:** SKU values must be unique. Creating a product with an existing SKU is rejected with an error.

**Price and quantity:** Must be positive values.

**Frontend form:** Provides fields for Name, SKU, Category, Price, Initial Quantity, and Low Stock Threshold, with all required fields validated before submission. The SKU field is disabled/read-only when editing an existing product.

## Product List UI

The Product List page displays Name, SKU, Category, Quantity, Price, and Status, with actions for:

- Search by product name or SKU
- Category filter
- Add Product
- Edit
- Delete
- Stock In
- Stock Out
- Transaction History

## Inventory Status

Status is derived from quantity vs. low-stock threshold:

```text
Quantity = 0                        → No Stock
Quantity < Low Stock Threshold      → Low Stock
Quantity >= Low Stock Threshold     → In Stock
```

Status is refreshed automatically after every stock operation.

## Stock Management APIs

### Stock IN

```http
POST /api/products/:id/stock-in
```

```json
{
    "quantity": 5,
    "note": "New stock received"
}
```

Increases the product quantity.

### Stock OUT

```http
POST /api/products/:id/stock-out
```

```json
{
    "quantity": 2,
    "note": "Product sold"
}
```

Decreases the product quantity.

### Stock Validation

Stock OUT is rejected when the requested quantity exceeds available stock:

```text
Available stock: 5
Requested stock out: 10
→ 400 Bad Request, { "message": "Insufficient stock" }
```

Inventory can never go negative. Quantities supplied for both Stock IN and Stock OUT must be greater than zero.

## Stock Transaction History

```http
GET /api/products/:id/transactions
```

Example: `GET /api/products/1/transactions`

Every successful stock movement records a transaction date, type (`IN` or `OUT`), quantity, and optional note. The product's quantity is updated after every successful movement.

## Transaction History UI

Displays Date, Type, Quantity, and Note for each product. Stock IN/OUT operations automatically refresh the displayed product quantity.

## Postman API Testing

A Postman collection is included at:

```text
postman/product-inventory-api.json
```

Import this file into Postman (**Import → File**) to test all backend endpoints. Make sure the backend is running on `http://localhost:5000` before sending requests, and that the database has been seeded (some requests assume product ID `1` exists).

**Collection structure:**

```text
Products
  ├── Create Product
  ├── Get Products
  ├── Search Products
  ├── Category Filter
  ├── Get Product By ID
  ├── Update Product
  └── Delete Product

Stock
  ├── Stock IN
  ├── Stock OUT
  └── Insufficient Stock

Transactions
  └── Transaction History
```

The collection uses a `{{baseUrl}}` variable, defaulting to `http://localhost:5000`. If your backend runs on a different port, update this variable in the collection's Variables tab rather than editing each request.

## Complete Application Setup (Quick Start)

```bash
# 1. Start MySQL, then seed the database
mysql -u root -p < database/inventory.sql

# 2. Start the backend (terminal 1)
cd backend
npm install
cp .env.example .env   # fill in your DB password
npm run dev

# 3. Start the frontend (terminal 2)
cd frontend
npm install
npm start
```

Open the frontend URL printed by Vite (typically `http://localhost:5173`). The backend API runs separately on `http://localhost:5000`.

## API Summary

| Method | Endpoint                         | Purpose                 |
| ------ | --------------------------------- | ------------------------ |
| POST   | `/api/products`                   | Add a product            |
| GET    | `/api/products`                   | Get products              |
| GET    | `/api/products/:id`                | Get one product           |
| PUT    | `/api/products/:id`                | Edit product              |
| DELETE | `/api/products/:id`                | Delete product            |
| POST   | `/api/products/:id/stock-in`       | Add stock                 |
| POST   | `/api/products/:id/stock-out`      | Remove stock              |
| GET    | `/api/products/:id/transactions`   | Get transaction history   |

## Assumptions

- MySQL is used as the database for the application.
- The database is named `inventory_db`.
- SKU values are unique and cannot be changed after product creation.
- Price and quantity must be positive values.
- Stock IN and Stock OUT quantities must be greater than zero.
- Stock OUT cannot exceed the currently available stock.
- Each successful stock movement creates a transaction record.
- The SQL file initializes the assignment database with the required schema and sample data.
- The application runs locally using Node.js, npm, and MySQL.
- The frontend communicates with the backend through REST APIs.

## Git Repository

The project was developed with multiple commits throughout implementation rather than a single squashed commit, preserving development history. The repository includes backend source, frontend source, database schema, seed data for 10 products, the Postman collection, and this documentation.

## Setup Notes

- `.env` is excluded from version control via `.gitignore` and must never be committed — it holds local database credentials. Only `.env.example` is tracked.
- `node_modules/` in both `backend/` and `frontend/` are excluded via `.gitignore` and are recreated locally with `npm install`.
- MySQL must be running **before** starting the backend, since the backend connects to it on startup.
- Run `database/inventory.sql` before first launching the application if the database hasn't already been created — the backend does not auto-create the schema.