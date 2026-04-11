import HeaderStyles from "./Header.module.css";
import { UserRoundPen } from "lucide-react";
import useGetDocuments from "../hooks/useGetDocuments";
import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";

export default function Header() {
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
                    style={{ cursor: "pointer", userSelect: "none" }}
                >
                    <UserRoundPen
                        size={32}
                        className={HeaderStyles["profile-pic-icon"]}
                    />
                </div>
                {isMenuOpen && (
                    <div className={HeaderStyles["logout-menu"]}
                    >
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
    );
}
