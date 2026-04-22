import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Theme } from "@radix-ui/themes";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";

import rootStyles from "./root.module.css";
import NotFoundImage from "../../public/Not_Found.png";

import { isAuthenticated } from "../utils/auth"; 

export const Route = createRootRoute({
    beforeLoad: ({ location }) => {
        const isAuth = isAuthenticated();
        if (!isAuth && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register') {
            window.location.href = "/login";
        }
    },
    component: () => {
        const isAuth = isAuthenticated();

        if (!isAuth) {
            return (
                <>
                    <Home>
                        <Outlet />
                    </Home>
                    <TanStackRouterDevtools />
                    <ReactQueryDevtools />
                </>
            );
        }

        return (
            <div className={rootStyles["app-container"]}>
                <Header />
                <div className={rootStyles.body}>
                    <Sidebar />
                    <main className={rootStyles["content-outlet"]}>
                        <Theme accentColor="blue" radius="large">
                            <Outlet />
                        </Theme>
                    </main>
                </div>
                <TanStackRouterDevtools />
                <ReactQueryDevtools />
            </div>
        );
    },
    notFoundComponent: () => {
        const pathname = useLocation({
            select: (location) => location.pathname,
        });
        const navigate = useNavigate();

        return (
            <div className={rootStyles["not-found-container"]}>
                <h1>404</h1>
                <p>{pathname}</p>
                <h2>Provided link to page was not found!</h2>
                <h4 style={{ cursor: 'pointer' }} onClick={() => navigate({ to: '/' })}>
                    Click <span style={{ color: 'var(--blue-9)', textDecoration: 'underline' }}>here</span> to go back to the home page!
                </h4>
                <img src={NotFoundImage} alt="Not Found" />
            </div>
        );
    },
});