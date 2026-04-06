import HeaderStyles from "./Header.module.css";
import { UserRoundPen } from "lucide-react";
import useGetDocuments from "../hooks/useGetDocuments";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";

export default function Header() {
    const allDocuments = useGetDocuments();
    const [searchResult, setSearchResult] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const searchRef = useRef();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function SearchResult({ id, title }) {
        return (
            <div
                className={HeaderStyles["search-result"]}
                onMouseDown={() => {
                    navigate({ to: `/documents/${id}` });
                }}
            >
                <p>{title}</p>
            </div>
        );
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate({ to: "/login" });
    }

    return (
        <div className={HeaderStyles.header}>
            <div className={HeaderStyles["left-side"]}>
                <h2 className={HeaderStyles["company-name"]}>
                    <Link to="/" className="RouterLink">
                        Document Manager
                    </Link>
                </h2>
            </div>
            <div className={HeaderStyles["right-side"]}>
                <div
                    ref={searchRef}
                    className={HeaderStyles["search-bar-container"]}
                >
                    <input
                        className={HeaderStyles["search-bar"]}
                        type="text"
                        onChange={(e) => {
                            setSearchResult(e.target.value);
                        }}
                        onFocus={(e) => {
                            setSearchResult(e.target.value);
                        }}
                        onBlur={() => setSearchResult("")}
                        placeholder="Search documents..."
                    />
                    {searchResult != "" ? (
                        <div
                            className={HeaderStyles["search-result-container"]}
                        >
                            {allDocuments.map((document) => {
                                if (
                                    document.title
                                        .toLowerCase()
                                        .includes(searchResult.toLowerCase())
                                ) {
                                    return (
                                        <SearchResult
                                            key={document.id}
                                            id={document.id}
                                            title={document.title}
                                        />
                                    );
                                }
                            })}
                        </div>
                    ) : null}
                </div>
                <button className={HeaderStyles["upload-btn"]}>Upload</button>
                {!token ? (
                    <div style={{ display: "flex", gap: "1rem" }}>
                        {/*<button className={HeaderStyles["upload-btn"]} onClick={() => navigate("/login")}>Login</button>*/}
                        {/*<button className={HeaderStyles["upload-btn"]} onClick={() => navigate("/register")}>Register</button>*/}
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <div
                            className={HeaderStyles["profile-pic"]}
                            onClick={() => navigate("/profile")}
                        >
                            <UserRoundPen size={32} />
                        </div>

                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
                <div
                    className={HeaderStyles["profile-pic"]}
                    onClick={toggleMenu}
                    style={{ cursor: "pointer", userSelect: "none" }}
                >
                    <UserRoundPen
                        size={32}
                        className={HeaderStyles["profile-pic-icon"]}
                    />
                </div>
                {isMenuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50px",
                            right: "0",
                            background: "white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "150px",
                            overflow: "hidden",
                            zIndex: 1000,
                        }}
                    >
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                padding: "12px 16px",
                                textDecoration: "none",
                                color: "inherit",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                padding: "12px 16px",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
