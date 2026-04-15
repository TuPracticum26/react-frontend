export default async function getUsersPage(page) {
    const response = await fetch(`/api/v1/users/${page}`);
    const data = await response.json();
    return data;
}
