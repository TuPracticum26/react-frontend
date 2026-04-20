import { Link, useLocation } from "@tanstack/react-router";
import DocumentImage from "../../public/Home_Document.png";
import { isAuthenticated } from "../utils/auth";

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

    // 1. Ако потребителят е на път /login или /register, показваме само тях (children)
    if (!isAuth && (pathname === "/login" || pathname === "/register")) {
        return <>{children}</>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
                backgroundColor: isAuth ? "var(--hover-color)" : "transparent",
                padding: "2rem",
            }}
        >
            {!isAuth ? (
                // 2. Екран за НЕЛОГНАТ потребител (Landing Page)
                <div style={{ maxWidth: "400px" }}>
                    <h1>Welcome to the Document Manager App!</h1>
                    <p>Please log in to continue</p>
                    <Link to="/login" className="RouterLink">
                        <button style={buttonStyle}>Login</button>
                    </Link>
                    <p style={{ fontSize: "14px", color: "#555", marginTop: "1rem" }}>
                        You don't have an account yet?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#4f64dc",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }}
                        >
                            Register here.
                        </Link>
                    </p>
                </div>
            ) : (
                // 3. Екран за ЛОГНАТ потребител (Dashboard Home)
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2rem",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h1 style={{ color: "var(--logo-color)", fontSize: "2.5rem", margin: 0 }}>
                        Welcome to the Document Manager App
                    </h1>
                    
                    <h2 style={{ fontWeight: "400", color: "#555", maxWidth: "600px" }}>
                        Navigate through the menus to read/write/alter Documents!
                    </h2>

                    <div
                        style={{
                            backgroundColor: "var(--secondary-color-soft)",
                            borderRadius: "50%",
                            width: "550px",
                            height: "550px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        }}
                    >
                        <img
                            src={DocumentImage}
                            alt="Home Document"
                            style={{ 
                                maxWidth: "400px", 
                                height: "auto",
                                filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.1))" 
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}