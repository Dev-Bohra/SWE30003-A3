const BASE_URL = "http://localhost:8080/customers";

export async function registerCustomer({ userId, firstName, lastName, email }) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: userId,
            firstName,
            lastName,
            email
        })
    });

    if (!res.ok) {
        if (res.status === 409) throw new Error("Email already registered");
        throw new Error("Registration failed");
    }

    return await res.json(); // Returns the full Customer object in JSON
}

export async function loginCustomer(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        if (res.status === 401) throw new Error("Incorrect password");
        if (res.status === 404) throw new Error("User not found");
        throw new Error("Login failed");
    }

    return await res.json(); // Returns CustomerInfo JSON
}