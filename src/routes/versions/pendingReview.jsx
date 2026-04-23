import { createFileRoute } from '@tanstack/react-router'
import Versions from '../../Versions/Versions'
import getAllPendingVersionsPage from '../../api/getAllPendingVersionsPage'
import { useQuery } from '@tanstack/react-query'
import { Flex, Skeleton, Text } from '@radix-ui/themes'
import rootStyles from '..//root.module.css'
import { useState } from 'react'
export const Route = createFileRoute('/versions/pendingReview')({
  component: ManagePendingReviewVersions,
})

function ManagePendingReviewVersions() {
    const [page, setPage] = useState(0);
    const { isLoading, data } = useQuery({
        queryKey: ["pending-review-versions", page],
        queryFn: () => getAllPendingVersionsPage(page),
        staleTime: 30000,
    });
    let arrayOfTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (isLoading) {
        return (
            <div className={rootStyles["loading-skeleton-container"]}>
                <Text>
                    <Skeleton> Select to which user manage</Skeleton>
                </Text>

                <Text style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem" }}>
                    <Skeleton> Lorem ipsum dolor </Skeleton>
                </Text>

                {arrayOfTen.map((i, index) => (
                    <LoadingSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <>
            <Versions versionsPage={data} page={page} setPage={setPage} functionality="Review"/>
        </>
    );
}

function LoadingSkeleton() {
    return (
        <>
            <Flex direction="row" gap="1" justify="center" align="center">
                <Text>
                    <Skeleton height="60px">
                        {" "}
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Praesent{" "}
                    </Skeleton>
                </Text>
            </Flex>
        </>
    );
}
