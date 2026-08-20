const db = require("../config/db");

const stockIn = async (id, quantity, note) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [products] = await connection.execute(
            "SELECT * FROM products WHERE id = ? FOR UPDATE",
            [id]
        );

        if (products.length === 0) {
            await connection.rollback();
            return null;
        }

        await connection.execute(
            "UPDATE products SET quantity = quantity + ? WHERE id = ?",
            [quantity, id]
        );

        await connection.execute(
            `INSERT INTO stock_transactions
            (product_id, type, quantity, note)
            VALUES (?, 'IN', ?, ?)`,
            [id, quantity, note || null]
        );

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    return true;
};

const stockOut = async (id, quantity, note) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [products] = await connection.execute(
            "SELECT * FROM products WHERE id = ? FOR UPDATE",
            [id]
        );

        if (products.length === 0) {
            await connection.rollback();
            return { productNotFound: true };
        }

        const product = products[0];

        if (product.quantity < quantity) {
            await connection.rollback();
            return { insufficientStock: true };
        }

        await connection.execute(
            "UPDATE products SET quantity = quantity - ? WHERE id = ?",
            [quantity, id]
        );

        await connection.execute(
            `INSERT INTO stock_transactions
            (product_id, type, quantity, note)
            VALUES (?, 'OUT', ?, ?)`,
            [id, quantity, note || null]
        );

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    return { success: true };
};

const getTransactions = async (id) => {
    const sql = `
        SELECT id, product_id, type, quantity, note, created_at
        FROM stock_transactions
        WHERE product_id = ?
        ORDER BY created_at DESC
    `;

    const [transactions] = await db.execute(sql, [id]);

    return transactions;
};

module.exports = {
    stockIn,
    stockOut,
    getTransactions
};