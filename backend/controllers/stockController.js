const stockModel = require("../models/stockModel");

const stockIn = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, note } = req.body;

        if (!quantity || Number(quantity) <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than zero"
            });
        }

        const result = await stockModel.stockIn(
            id,
            Number(quantity),
            note
        );

        if (!result) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Stock added successfully"
        });

    } catch (error) {
        console.error("Stock in error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const stockOut = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, note } = req.body;

        if (!quantity || Number(quantity) <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than zero"
            });
        }

        const result = await stockModel.stockOut(
            id,
            Number(quantity),
            note
        );

        if (result.productNotFound) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (result.insufficientStock) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        res.status(200).json({
            message: "Stock removed successfully"
        });

    } catch (error) {
        console.error("Stock out error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const { id } = req.params;

        const transactions = await stockModel.getTransactions(id);

        res.status(200).json(transactions);

    } catch (error) {
        console.error("Get transactions error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    stockIn,
    stockOut,
    getTransactions
};