const productModel = require("../models/productModel");

const createProduct = async (req, res) => {
    try {
        const {name,sku,category,price,quantity,low_stock_threshold} = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Product name is required"
            });
        }

        if (!sku || !sku.trim()) {
            return res.status(400).json({message: "SKU is required"});
        }

        if (!category || !category.trim()) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Number validation
        if (price === undefined || price === null || Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than zero"});
        }

        if (quantity === undefined || quantity === null || Number(quantity) <= 0) {
            return res.status(400).json({message: "Quantity must be greater than zero"});
        }

        if (low_stock_threshold === undefined ||low_stock_threshold === null || Number(low_stock_threshold) < 0) {
            return res.status(400).json({message: "Low stock threshold cannot be negative"});
        }

        const product = {
            name: name.trim(),
            sku: sku.trim(),
            category: category.trim(),
            price: Number(price),
            quantity: Number(quantity),
            low_stock_threshold: Number(low_stock_threshold)
        };

        const result = await productModel.createProduct(product);

        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId
        });

    } catch (error) {
        // Duplicate SKU
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "SKU already exists"
            });
        }

        console.error("Create product error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {createProduct};