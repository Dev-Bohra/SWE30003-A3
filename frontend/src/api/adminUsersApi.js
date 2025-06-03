const BASE_URL = "http://localhost:8080/api/users";

export async function fetchAllUsers() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
}

export async function deleteUserApi(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
}
