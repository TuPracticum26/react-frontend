import { useState, useEffect } from "react";

export default function useGetUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            const response = await fetch("/api/v1/users");
            const data = await response.json();
            setUsers(data);
            return data;
        }
        getUsers();
    }, []);

    return users;
}
