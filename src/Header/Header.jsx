import HeaderStyles from "./Header.module.css";
import { UserRoundPen } from "lucide-react";
import useGetDocuments from "../hooks/useGetDocuments";
import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";

export default function Header() {
    const token = JSON.parse(localStorage.getItem("token"));
    const allDocuments = useGetDocuments();
    const [searchResult, setSearchResult] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const searchRef = useRef();

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
        window.location.reload();
    }

    return (
        <div className={HeaderStyles.header}>
            <div className={HeaderStyles["left-side"]}>
                <h2 className={HeaderStyles["company-name"]}>
                    <Link to="/" className="RouterLink">
                        Document Manager
                    </Link>
                </h2>
                {!token?.roles?.includes("READER") ? (
                    <h3 className={HeaderStyles["header-link"]}>
                        <Link to="/dashboard" className="RouterLink">
                            Dashboard
                        </Link>
                    </h3>
                ) : null}
                {token?.roles?.includes("ADMIN") ? (
                    <h3 className={HeaderStyles["header-link"]}>
                        <Link to="/setrole" className="RouterLink">
                            Set Role
                        </Link>
                    </h3>
                ) : null}
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
                <div
                    className={HeaderStyles["profile-pic"]}
                    onClick={toggleMenu}
                    tabIndex="0"
                >
                    <UserRoundPen
                        size={32}
                        className={HeaderStyles["profile-pic-icon"]}
                    />
                    {isMenuOpen && (
                        <div className={HeaderStyles["logout-menu"]}>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className={HeaderStyles["logout-btn"]}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
