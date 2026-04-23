import { getUser, getToken, logout } from "../utils/auth";

export default async function getTeamVersions() {
    const user = getUser();
    const token = getToken();

    try {
        const response = await fetch(`/api/v1/users/versions/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 403) {
            logout();
            alert("Your session has expired. Please log in again.");
            window.location.href = "/login";
        }
        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getUserVersions:", error);
    }
}