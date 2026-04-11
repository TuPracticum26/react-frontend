import { useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/v1/auth/register", form);
            alert("Account created successfully!");
            navigate({ to: "/login" });
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Registration failed!");
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
                width: "100%",
                height: "100%"
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
                    Register
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        style={inputStyle}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Enter a password"
                        style={inputStyle}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <button style={buttonStyle} type="submit">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
