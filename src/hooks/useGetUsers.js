import { useState, useEffect, logout } from "react";

export default function useGetUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("auth"));

        if (!token || !token.token) {
            console.error("Няма валиден токен в localStorage");
            setUsers([]);
            return;
        }

        async function getUsers() {
            try {
                const response = await fetch("/api/v1/users", {
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
                    setUsers([]);
                    return;
                }

                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
                return data;
            } catch (error) {
                console.error("Грешка при зареждане:", error);
                setUsers([]);
            }
        }
        getUsers();
    }, []);

    return users;
}
