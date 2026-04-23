import { useEffect, logout } from "react";

export default async function useGetAllPendingVersions() {
    const token = JSON.parse(localStorage.getItem("auth"));

    if (!token || !token.token) {
        console.error("Няма валиден токен в localStorage");
        return;
    }
        try {
            const response = await fetch("/api/v1/users/versions/pending", {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 403) {
                logout();
                alert("Your session has expired. Please log in again.");
                window.location.href = "/login";
            }

            if (!response.ok) {
                const text = await response.text();
                console.error(`Request failed ${response.status}:`, text);
                return;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Грешка при зареждане:", error);
        }
}
