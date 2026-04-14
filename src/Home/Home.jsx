import { Link, useLocation } from "@tanstack/react-router";
import DocumentImage from '../../public/Home_Document.png'

export default function Home({ children }) {
    const token = JSON.parse(localStorage.getItem("token"));
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "80%",
                height: "100%",
                paddingLeft: "20%",
            }}
        >
            <div style={{backgroundColor: "var(--hover-color)", padding: "2rem", height: "100%", width: "100%"}}>

            
            {!token ? 
            pathname == "/login" || pathname == "/register" ? (
                <>{children}</>
            ) : (
                <>
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
            )
            :
            <div style={{display: "flex", flexDirection: "column", gap:"2rem", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{color:"var(--logo-color)"}}>Welcome to the Document Manager App</h1>
            <h2>Navigate through the menus to read/write/alter Documents!</h2>
            <div style={{backgroundColor: "var(--secondary-color-soft)", borderRadius: "100vw", minWidth: "600px", minHeight: "600px", display: "flex", flexDirection: "column", gap:"2rem", justifyContent: "center", alignItems: "center"}}>
                <img src={DocumentImage} alt="" style={{maxWidth: "400px"}}/>
            </div>
            </div> 
            }
            </div>
            </div>
        );
}
