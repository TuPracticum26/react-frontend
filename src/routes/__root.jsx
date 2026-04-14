import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import rootStyles from "./root.module.css";
import Home from "../Home/Home";
import { Theme } from "@radix-ui/themes";
import NotFoundImage from "../../public/Not_Found.png";

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
                                <Theme>
                                    <Outlet />
                                </Theme>
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
    notFoundComponent: () => {
        const pathname = useLocation({
            select: (location) => location.pathname,
        });
        return (
            <div className={rootStyles["not-found-container"]}>
                <h1>404</h1>
                <p>{pathname}</p>
                <h2>Provided link to page was not found!</h2>
                <h4>Click <span>here</span> to go back to the home page!</h4>
                <img src={NotFoundImage} alt="" />
            </div>
        );
    },
});
