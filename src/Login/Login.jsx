import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import axios from "axios";
import { login } from "../utils/auth";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/login", form);
            login(res.data);
            await router.invalidate();
            window.location.href = "/";
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Login failed! Please check your credentials.");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
        boxSizing: "border-box",
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
        transition: "background 0.2s",
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea, #764ba3)",
                width: "100%",
                height: "100vh",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "2.5rem",
                    borderRadius: "16px",
                    width: "380px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "1.5rem",
                        color: "#333",
                    }}
                >
                    Welcome Back 👋
                </h2>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        style={inputStyle}
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        style={inputStyle}
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        style={buttonStyle}
                    >
                        Login
                    </button>

                    <p
                        style={{
                            fontSize: "14px",
                            color: "#555",
                            marginTop: "1.5rem",
                            textAlign: "center",
                        }}
                    >
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
                </form>
            </div>
        </div>
    );
}
