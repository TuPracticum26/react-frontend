export default async function getVersionsPage(userId, page) {
    const response = await fetch(`/api/v1/users/${userId}/versions/${page}`);
    const data = await response.json();
    return data;
}
