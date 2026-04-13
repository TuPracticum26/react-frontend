import rootStyles from "./root.module.css";
import { createLazyFileRoute } from "@tanstack/react-router";
import ManageUsers from "../ManageUsers/ManageUsers.jsx";
import { useQuery } from "@tanstack/react-query";
import getUsers from "../api/getUsers.js";
import { useState } from "react";
import { Flex, Skeleton, Text } from "@radix-ui/themes";

export const Route = createLazyFileRoute("/manageUsers")({
    component: ManageUsersRoute,
});

function ManageUsersRoute() {
    const [page, setPage] = useState(0);
    const { isLoading, data } = useQuery({
        queryKey: ["users", page],
        queryFn: () => getUsers(page),
        staleTime: 30000,
    });
    let arrayOfFive = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (isLoading) {
        return (
        <div className={rootStyles["loading-skeleton-container"]}>
            <Text>
                <Skeleton> Select to which user manage</Skeleton>
            </Text>

            <Text style={{paddingTop:"0.3rem", paddingBottom:"0.3rem"}}>
                <Skeleton> Lorem ipsum dolor </Skeleton>
            </Text>

                {arrayOfFive.map((i) => (
                    <LoadingSkeleton />
                ))}
            </div>
        );
    }

    return (
        <>
            <ManageUsers allUsers={data} page={page} setPage={setPage} />
        </>
    );
}

function LoadingSkeleton() {
    return (
        <>
            <Flex direction="row" gap="1" justify="center" align="center">
                <Text>
                    <Skeleton height="60px"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesent  </Skeleton>
                </Text>
            </Flex>
        </>
    );
}
