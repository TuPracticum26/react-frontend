import { useState } from "react";
import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import rootStyles from "./root.module.css";

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <Header />
                <div className={rootStyles.body}>
                    <Sidebar />
                    <main>
                        <Outlet />
                    </main>
                </div>
                <TanStackRouterDevtools />
            </>
        );
    },
});
