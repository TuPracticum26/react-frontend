import { getUser, getToken } from "../utils/auth";

export default async function getUserVersions(whichDocuments) {
    const user = getUser();
    const token = getToken();
    console.log("HELLO")
    console.log(user);

    try {
        const res = await fetch(`/api/v1/users/${user.id}/versions`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error in getUserVersions:", error);
        return { userVersionArray: [], allVersionArray: [] };
    }
}