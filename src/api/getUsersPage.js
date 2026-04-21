export default async function getUsersPage(page) {
    const response = await fetch(`/api/v1/users/${page}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token || ""}`,
        },
    });
    const data = await response.json();
    return data;
}
