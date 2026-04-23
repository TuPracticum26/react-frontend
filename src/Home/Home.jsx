import { Link, useLocation } from "@tanstack/react-router";
import DocumentImage from "../../public/Home_Document.png";
import { isAuthenticated } from "../utils/auth";
import HomeStyles from './Home.module.css'

export default function Home({ children }) {
    const isAuth = isAuthenticated();
    const { pathname } = useLocation();

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#4f64dc",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "1rem"
    };

    if (!isAuth && (pathname === "/login" || pathname === "/register")) {
        return <>{children}</>;
    }

    return (
        <div className={HomeStyles["home-container"]}
            style={{backgroundColor: isAuth ? "var(--hover-color)" : "transparent"}}
        >
            {!isAuth ? (
                <div className={HomeStyles["home-content-container"]}>
                    <h1>Welcome to the Document Manager App!</h1>
                    <p>Please log in to continue</p>
                    <Link to="/login" className="RouterLink">
                        <button style={buttonStyle}>Login</button>
                    </Link>
                    <p className={HomeStyles["label"]}>
                        You don't have an account yet?{" "}
                        <Link
                            to="/register"
                            className={HomeStyles["login-btn"]}
                        >
                            Register here.
                        </Link>
                    </p>
                </div>
            ) : (
                <div
                className={HomeStyles["welcome-screen"]}
                >
                    <h1 className={HomeStyles["logo-heading-1"]}>
                        Welcome to the Document Manager App
                    </h1>
                    
                    <h2 className={HomeStyles["logo-heading-2"]}>
                        Navigate through the menus to read/write/alter Documents!
                    </h2>

                    <div
                        className={HomeStyles["image-container"]}
                    >
                        <img
                            src={DocumentImage}
                            alt="Home Document"
                            className={HomeStyles["home-image"]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}