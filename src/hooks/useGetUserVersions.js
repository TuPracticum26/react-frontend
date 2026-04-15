import { useState, useEffect } from "react";

export default function useGetUserVersion(userId) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsersVersions() {
            const response = await fetch(`/api/v1/users/${userId}/versions`);
            const data = await response.json();
            setUsers(data);
            return data;
        }
        getUsersVersions();
    }, []);

    return users;
}
