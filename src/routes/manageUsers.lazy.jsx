import { createLazyFileRoute } from "@tanstack/react-router";
import ManageUsers from "../ManageUsers/ManageUsers.jsx";

export const Route = createLazyFileRoute("/manageUsers")({
    component: ManageUsers,
});
