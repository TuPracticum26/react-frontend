import { createFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createFileRoute("/versions/drafts")({
    component: DraftVersions,
});

function DraftVersions() {
    return (
        <>
            <Versions functionality="Draft" />
        </>
    );
}
