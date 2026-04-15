import { createFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createFileRoute("/versions/pending")({
    component: PendingVersions,
});

function PendingVersions() {
    return (
        <>
            <Versions functionality="Pending" />
        </>
    );
}
