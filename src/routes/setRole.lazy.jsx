import { createLazyFileRoute } from "@tanstack/react-router";
import SetRole from "../SetRole/SetRole.jsx";

export const Route = createLazyFileRoute("/setRole")({
    component: SetRole,
});
