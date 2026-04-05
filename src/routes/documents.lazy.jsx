import { createLazyFileRoute } from "@tanstack/react-router";
import Documents from "../Documents/Documents";
export const Route = createLazyFileRoute("/documents")({
    component: Documents,
});
