import { useEffect, useState } from "react";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import StockIn from "./StockIn";
import StockOut from "./StockOut";
import TransactionHistory from "./TransactionHistory";

import {
    getProducts,
    deleteProduct
} from "../services/productService";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [editingProduct, setEditingProduct] = useState(null);
    const [stockInProduct, setStockInProduct] = useState(null);
    const [stockOutProduct, setStockOutProduct] = useState(null);
    const [transactionProduct, setTransactionProduct] = useState(null);

    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            const data = await getProducts(search, category);
            setProducts(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    const categories = [
        ...new Set(products.map((product) => product.category))
    ];

    return (
        <div className="container">
            <h1>Product Inventory</h1>

            {error && <p className="error">{error}</p>}

            <AddProduct onProductAdded={fetchProducts} />

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name or SKU"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                >
                    <option value="">All Categories</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>

                            <td>{product.sku}</td>

                            <td>{product.category}</td>

                            <td>{product.quantity}</td>

                            <td>₹{product.price}</td>

                            <td>
    {product.quantity === 0 ? (
        <span className="no-stock">
            No Stock
        </span>
    ) : product.quantity < product.low_stock_threshold ? (
        <span className="low-stock">
            Low Stock
        </span>
    ) : (
        <span className="in-stock">
            In Stock
        </span>
    )}
</td>

                            <td>
                                <button
                                    onClick={() =>
                                        setEditingProduct(product)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(product.id)
                                    }
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() =>
                                        setStockInProduct(product)
                                    }
                                >
                                    Stock In
                                </button>

                                <button
                                    onClick={() =>
                                        setStockOutProduct(product)
                                    }
                                >
                                    Stock Out
                                </button>

                                <button
                                    onClick={() =>
                                        setTransactionProduct(product)
                                    }
                                >
                                    History
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingProduct && (
                <EditProduct
                    product={editingProduct}
                    onProductUpdated={() => {
                        setEditingProduct(null);
                        fetchProducts();
                    }}
                    onCancel={() => setEditingProduct(null)}
                />
            )}

            {stockInProduct && (
                <StockIn
                    product={stockInProduct}
                    onStockUpdated={() => {
                        setStockInProduct(null);
                        fetchProducts();
                    }}
                    onCancel={() => setStockInProduct(null)}
                />
            )}

            {stockOutProduct && (
                <StockOut
                    product={stockOutProduct}
                    onStockUpdated={() => {
                        setStockOutProduct(null);
                        fetchProducts();
                    }}
                    onCancel={() => setStockOutProduct(null)}
                />
            )}

            {transactionProduct && (
                <TransactionHistory
                    product={transactionProduct}
                    onClose={() => setTransactionProduct(null)}
                />
            )}
        </div>
    );
}

export default ProductList;