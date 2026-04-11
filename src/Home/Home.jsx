import { Link, useLocation } from "@tanstack/react-router";

export default function Home({ children }) {
    const pathname = useLocation({
        select: (location) => location.pathname,
    });
    const buttonStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#4f64dc",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    };

    return (
        <div
            style={{
                mineHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
            }}
        >
            {pathname == "/login" || pathname == "/register" ? (
                <>{children}</>
            ) : (
                <>
                    {console.log(pathname)}
                    <h1>Welcome to the Document Manager App!</h1>
                    <p>Please log in to continue</p>
                    <Link to="/login" className="RouterLink">
                        <button style={buttonStyle}>Login</button>
                    </Link>
                    <p style={{ fontStyle: "14px", color: "#555" }}>
                        You don't have an account yet?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#4f64dc",
                                textDecoration: "none",
                                fontweight: "bold",
                            }}
                        >
                            Register here.
                        </Link>
                    </p>
                </>
            )}
        </div>
    );
}
