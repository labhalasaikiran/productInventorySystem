import { useState } from "react";
import { stockOut } from "../services/productService";

function StockOut({ product, onStockUpdated, onCancel }) {
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (Number(quantity) <= 0) {
            setError("Quantity must be greater than zero");
            return;
        }

        if (Number(quantity) > product.quantity) {
            setError("Stock quantity cannot exceed available stock");
            return;
        }

        try {
            await stockOut(product.id, Number(quantity), note);

            onStockUpdated();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Stock Out</h2>

            <p>Product: {product.name}</p>
            <p>Available Stock: {product.quantity}</p>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Note (optional)"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                />

                <button type="submit">Remove Stock</button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default StockOut;