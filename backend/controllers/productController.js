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
const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const products = await productModel.getProducts(search, category);

        res.status(200).json(products);
    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.getProductById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            category,
            price,
            quantity,
            low_stock_threshold
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Product name is required"
            });
        }

        if (!category || !category.trim()) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        if (Number(price) <= 0) {
            return res.status(400).json({
                message: "Price must be greater than zero"
            });
        }

        if (Number(quantity) <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than zero"
            });
        }

        const result = await productModel.updateProduct(id, {
            name: name.trim(),
            category: category.trim(),
            price: Number(price),
            quantity: Number(quantity),
            low_stock_threshold: Number(low_stock_threshold)
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await productModel.deleteProduct(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};
module.exports = {createProduct, getProducts, getProductById, updateProduct,deleteProduct

};