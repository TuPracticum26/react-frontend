import { createLazyFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createLazyFileRoute("/versions/rejected")({
    component: RejectedVersions,
});

function RejectedVersions() {
    return (
        <>
            <Versions functionality="Rejected" />
        </>
    );
}
