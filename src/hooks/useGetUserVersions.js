import { useState, useEffect } from "react";

export default function useGetUserVersion(userId) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));

        if (!token || !token.token) {
            console.error("Няма валиден токен в localStorage");
            setUsers([]);
            return;
        }

        async function getUsersVersions() {
            try {
                const response = await fetch(
                    `/api/v1/users/${userId}/versions`,
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))?.token || ""}`,
                            "Content-Type": "application/json",
                        },
                    },
                );

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
        getUsersVersions();
    }, []);

    return users;
}
