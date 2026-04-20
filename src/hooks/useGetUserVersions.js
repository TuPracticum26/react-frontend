import { getUser, getToken } from "../utils/auth";

export default async function getUserVersions(docId, whichDocuments) {
    const user = getUser();
    const token = getToken();

    try {
        const res = await fetch(`/api/v1/documents/${docId}/history`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        const versions = data.versions || [];

        const allVersionArray = whichDocuments === "all" ? [...versions] : [];
        const userVersionArray = versions.filter(
            (v) => v.createdByUsername === user?.username
        );

        return { userVersionArray, allVersionArray };
    } catch (error) {
        console.error("Error in getUserVersions:", error);
        return { userVersionArray: [], allVersionArray: [] };
    }
}