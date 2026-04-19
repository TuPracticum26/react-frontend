export default async function getTeamVersionsPage(page) {
    const response = await fetch(`/api/v1/users/versions/${page}`);
    const data = await response.json();
    return data;
}
