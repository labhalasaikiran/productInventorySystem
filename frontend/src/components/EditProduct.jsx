import { useEffect, useState } from "react";
import { updateProduct } from "../services/productService";

function EditProduct({ product, onProductUpdated, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        low_stock_threshold: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
                low_stock_threshold: product.low_stock_threshold
            });
        }
    }, [product]);

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

        if (!formData.name.trim()) {
            setError("Name is required");
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
            await updateProduct(product.id, {
                name: formData.name.trim(),
                category: formData.category.trim(),
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                low_stock_threshold: Number(formData.low_stock_threshold)
            });

            onProductUpdated();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Product</h2>

            {error && <p className="error">{error}</p>}

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
                    value={formData.sku}
                    readOnly
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
                    placeholder="Quantity"
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

                <button type="submit">Update Product</button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditProduct;