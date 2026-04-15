import { createFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createFileRoute("/versions/approved")({
    component: ApprovedVersions,
});

function ApprovedVersions() {
    return (
        <>
            <Versions functionality="Approved" />
        </>
    );
}
