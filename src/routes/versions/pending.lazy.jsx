import { createLazyFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createLazyFileRoute("/versions/pending")({
    component: PendingVersions,
});

function PendingVersions() {
    return (
        <>
            <Versions functionality="Pending" />
        </>
    );
}
