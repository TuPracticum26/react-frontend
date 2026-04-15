import { createFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createFileRoute("/versions/rejected")({
    component: RejectedVersions,
});

function RejectedVersions() {
    return (
        <>
            <Versions functionality="Rejected" />
        </>
    );
}
