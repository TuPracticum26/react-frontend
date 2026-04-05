import {useNavigate, Link} from "react-router-dom";


export default function Home() {
    const navigate = useNavigate();
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
        <div style={{
            mineHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <h1>Welcome to the Document Manager App!</h1>
            <p>Please log in to continue</p>
            <button
                style={buttonStyle}
                onClick={() => navigate("/login")}>
                Login
            </button>
            <p style={{ fontStyle: "14px", color: "#555"}}>
                You don't have an account yet?{" "}
                <Link to="/register" style={{ color: "#4f64dc", textDecoration: "none", fontweight: "bold" }}>
                    Register here.
                </Link>
            </p>
        </div>
    )
}