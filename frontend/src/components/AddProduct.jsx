import { useState } from "react";
import { createProduct } from "../services/productService";

function AddProduct({ onProductAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        low_stock_threshold: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        if (!formData.sku.trim()) {
            setError("SKU is required");
            return;
        }

        if (!formData.category.trim()) {
            setError("Category is required");
            return;
        }

        if (Number(formData.price) <= 0) {
            setError("Price must be greater than zero");
            return;
        }

        if (Number(formData.quantity) <= 0) {
            setError("Quantity must be greater than zero");
            return;
        }

        if (Number(formData.low_stock_threshold) < 0) {
            setError("Low stock threshold cannot be negative");
            return;
        }

        try {
            await createProduct({
                name: formData.name.trim(),
                sku: formData.sku.trim(),
                category: formData.category.trim(),
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                low_stock_threshold: Number(formData.low_stock_threshold)
            });

            setMessage("Product added successfully");

            setFormData({
                name: "",
                sku: "",
                category: "",
                price: "",
                quantity: "",
                low_stock_threshold: ""
            });

            onProductAdded();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Add Product</h2>

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Initial Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="low_stock_threshold"
                    placeholder="Low Stock Threshold"
                    value={formData.low_stock_threshold}
                    onChange={handleChange}
                />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;