import { useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/login", form);
            const username = res.config.data
                .match(/[^({"username":")].+","password"./)[0]
                .slice(0, -13);
            localStorage.setItem("username", username);
            localStorage.setItem("token", res.data.token);
            navigate({ to: "/dashboard" });
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Login failed!");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
    };

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
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea, #764ba3)",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "16px",
                    width: "350px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    Welcome Back 👋
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        style={inputStyle}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        style={inputStyle}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <button style={buttonStyle}>Login</button>
                </form>
            </div>
        </div>
    );
}
