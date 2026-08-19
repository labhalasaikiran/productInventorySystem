const db = require("../config/db");

const createProduct = async (product) => {
    const sql = `
        INSERT INTO products
        (name, sku, category, price, quantity, low_stock_threshold)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        product.name,
        product.sku,
        product.category,
        product.price,
        product.quantity,
        product.low_stock_threshold
    ];

    const [result] = await db.execute(sql, values);

    return result;
};
const getProducts = async (search, category) => {
    let sql = "SELECT * FROM products";
    const values = [];

    if (search) {
        sql += " WHERE name LIKE ? OR sku LIKE ?";
        values.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        if (search) {
            sql += " AND category = ?";
        } else {
            sql += " WHERE category = ?";
        }

        values.push(category);
    }

    const [products] = await db.execute(sql, values);

    return products;
};
const getProductById = async (id) => {
    const sql = "SELECT * FROM products WHERE id = ?";

    const [products] = await db.execute(sql, [id]);

    return products[0];
};
const updateProduct = async (id, product) => {
    const sql = `
        UPDATE products
        SET name = ?,
            category = ?,
            price = ?,
            quantity = ?,
            low_stock_threshold = ?
        WHERE id = ?
    `;

    const values = [
        product.name,
        product.category,
        product.price,
        product.quantity,
        product.low_stock_threshold,
        id
    ];

    const [result] = await db.execute(sql, values);

    return result;
};
const deleteProduct = async (id) => {
    const sql = "DELETE FROM products WHERE id = ?";

    const [result] = await db.execute(sql, [id]);

    return result;
};
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};