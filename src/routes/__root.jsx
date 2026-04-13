import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import rootStyles from "./root.module.css";
import Home from "../Home/Home";

const token = localStorage.getItem("token");

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                {token ? (
                    <>
                        <Header />
                        <div className={rootStyles.body}>
                            <Sidebar />
                            <main>
                                <Outlet />
                            </main>
                        </div>
                    </>
                ) : (
                    <Home>
                        <Outlet />
                    </Home>
                )}
                <TanStackRouterDevtools />
                <ReactQueryDevtools />
            </>
        );
    },
});
