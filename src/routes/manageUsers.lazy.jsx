import { createLazyFileRoute } from "@tanstack/react-router";
import ManageUsers from "../ManageUsers/ManageUsers.jsx";
import { useQuery } from "@tanstack/react-query";
import getUsers from "../api/getUsers.js";
import { useState } from "react";

export const Route = createLazyFileRoute("/manageUsers")({
    component: ManageUsersRoute,
});

function ManageUsersRoute() {
    const [page, setPage] = useState(0);
    const { isLoading, data } = useQuery({
        queryKey: ["users", page],
        queryFn: () => getUsers(page),
        staleTime: 30000
    })

    if (isLoading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <>
            <ManageUsers allUsers={data} page={page} setPage={setPage} />
        </>
    )
}