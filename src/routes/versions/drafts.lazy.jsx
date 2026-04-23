import { createLazyFileRoute } from "@tanstack/react-router";
import Versions from "../../Versions/Versions";

export const Route = createLazyFileRoute("/versions/drafts")({
    component: DraftVersions,
});

function DraftVersions() {
    return (
        <>
            <Versions functionality="Draft" />
        </>
    );
}
