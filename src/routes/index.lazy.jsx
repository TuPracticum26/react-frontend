import { createLazyFileRoute } from "@tanstack/react-router";
import Home from "../Home/Home";
export const Route = createLazyFileRoute("/")({
    component: Home,
});
