import { useEffect, useState } from "react";
import { getTransactions } from "../services/productService";

function TransactionHistory({ product, onClose }) {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions(product.id);
                setTransactions(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTransactions();
    }, [product.id]);

    return (
        <div className="form-container">
            <h2>Transaction History</h2>

            <p>
                <strong>Product:</strong> {product.name}
            </p>

            {error && <p className="error">{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Note</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>
                                {new Date(
                                    transaction.created_at
                                ).toLocaleString()}
                            </td>

                            <td>{transaction.type}</td>

                            <td>{transaction.quantity}</td>

                            <td>{transaction.note || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default TransactionHistory;