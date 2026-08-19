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
const getProducts = async () => {
    const sql = "SELECT * FROM products";
    const [products] = await db.execute(sql);

    return products;
};
module.exports = {
    createProduct,
    getProducts
};