import { useEffect, useState } from "react";

function ProductList() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {fetchProducts();}, []);

    return (
        <div>
            <h1  className="">Product Inventory</h1>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
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
                                {product.quantity <
                                product.low_stock_threshold ? (
                                    <span>Low Stock</span>
                                ) : (
                                    <span>In Stock</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;