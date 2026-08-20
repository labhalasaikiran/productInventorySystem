import { useState } from "react";
import { stockIn } from "../services/productService";

function StockIn({ product, onStockUpdated, onCancel }) {
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

        try {
            await stockIn(product.id, Number(quantity), note);

            onStockUpdated();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Stock In</h2>

            <p>Product: {product.name}</p>

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

                <button type="submit">Add Stock</button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default StockIn;