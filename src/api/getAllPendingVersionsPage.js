export default async function getAllPendingVersionsPage(page) {
    const response = await fetch(`/api/v1/users/versions/pending/${page}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token || ""}`,
        },
    });
    const data = await response.json();
    return data;
}
