const BASE_URL = "http://localhost:8080/api/support";

export async function fetchAllUsers() {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json(); // Array of Customer objects
}
export async function updateCustomerInfo(id, updatedFields) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
    });

    if (!res.ok) throw new Error('Failed to update customer');
}

export async function fetchAllSupportTickets() {
    const res = await fetch(`${BASE_URL}/all`);
    if (!res.ok) throw new Error('Failed to fetch support tickets');
    return await res.json(); // Array of SupportTicket objects
}

export async function updateSupportTicketStatus(ticketId, newStatus) {
    const res = await fetch(`${BASE_URL}/status/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
}

export async function deleteCustomer(customerId) {
    const res = await fetch(`${BASE_URL}/${customerId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete customer');
}
