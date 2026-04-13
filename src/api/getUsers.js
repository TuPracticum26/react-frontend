export default async function getUsers(page) {
    const response = await fetch(`/api/v1/users/${page}`);
    const data = await response.json();
    return data;
}
