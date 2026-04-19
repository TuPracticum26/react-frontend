export default async function getTeamVersionsPage(page) {
    const response = await fetch(`/api/v1/users/versions/${page}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))?.token || ""}`,
        },
    });
    const data = await response.json();
    return data;
}
