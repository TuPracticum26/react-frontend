import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
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
    component: () => {
        const isAuth = isAuthenticated();

        // Ако потребителят НЕ е логнат, показваме Home компонента (Landing/Login/Register)
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

        // Ако потребителят Е логнат, показваме пълната структура на приложението
        return (
            <div className={rootStyles["app-container"]}>
                <Header />
                <div className={rootStyles.body}>
                    <Sidebar />
                    <main className={rootStyles["content-outlet"]}>
                        <Theme>
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

        return (
            <div className={rootStyles["not-found-container"]}>
                <h1>404</h1>
                <p>{pathname}</p>
                <h2>Provided link to page was not found!</h2>
                <h4>
                    Click <span>here</span> to go back to the home page!
                </h4>
                <img src={NotFoundImage} alt="Not Found" />
            </div>
        );
    },
});