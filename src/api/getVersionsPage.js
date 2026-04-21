export default async function getVersionsPage(userId, page) {
    const response = await fetch(`/api/v1/users/${userId}/versions/${page}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token || ""}`,
        },
    });
    const data = await response.json();
    return data;
}
