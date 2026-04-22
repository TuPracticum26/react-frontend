import { createLazyFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createLazyFileRoute("/versions/approved")({
    component: ApprovedVersions,
});

function ApprovedVersions() {
    return (
        <>
            <Versions functionality="Approved" />
        </>
    );
}
