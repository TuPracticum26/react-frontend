import { createRootRoute, Outlet } from '@tanstack/react-router';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './root.module.css'; // Използвай твоя Grid CSS

export const Route = createRootRoute({
    component: () => {
        const tokenData = localStorage.getItem("token");
        const token = tokenData ? JSON.parse(tokenData).user : null;

        // Ако няма токен, рендираме само Outlet-а (за Login/Register)
        if (!token) {
            return <Outlet />;
        }

        // Ако има токен, показваме цялата структура
        return (
            <div className={styles["app-container"]}>
                <Header />
                <div className={styles["body"]}>
                    <Sidebar />
                    <main className={styles["content-outlet"]}>
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    },
});