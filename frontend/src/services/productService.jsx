const API_URL = "http://localhost:5000/api/products";

export const getProducts = async (search = "", category = "") => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (category) {
        params.append("category", category);
    }

    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
    }

    return data;
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
    }

    return data;
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
    }

    return data;
};

export const stockIn = async (id, quantity, note) => {
    const response = await fetch(`${API_URL}/${id}/stock-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantity,
            note
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add stock");
    }

    return data;
};

export const stockOut = async (id, quantity, note) => {
    const response = await fetch(`${API_URL}/${id}/stock-out`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantity,
            note
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to remove stock");
    }

    return data;
};

export const getTransactions = async (id) => {
    const response = await fetch(`${API_URL}/${id}/transactions`);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return response.json();
};