import HeaderStyles from "./Header.module.css";
import { UserRoundPen } from "lucide-react";
import useGetDocuments from "../hooks/useGetDocuments";
import { useState, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { getUser, logout } from "../utils/auth";

export default function Header() {
    const user = getUser();
    const navigate = useNavigate();
    
    const { documents } = useGetDocuments();
    const allDocuments = documents || []; 
    
    const [searchResult, setSearchResult] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const searchRef = useRef();

    function SearchResult({ id, title }) {
        return (
            <div
                className={HeaderStyles["search-result"]}
                onMouseDown={() => navigate({ to: `/documents/${id}` })}
            >
                <p>{title}</p>
            </div>
        );
    }

    function handleLogout() {
        logout();
        window.location.href = "/";
    }

    return (
        <div className={HeaderStyles.header}>
            <div className={HeaderStyles["left-side"]}>
                <h2 className={HeaderStyles["company-name"]}>
                    <Link to="/" className="RouterLink">Document Manager</Link>
                </h2>
                
                {!user?.roles?.includes("READER") && (
                    <h3 className={HeaderStyles["header-link"]}>
                        <Link to="/dashboard" className="RouterLink">Dashboard</Link>
                    </h3>
                )}
                
                {user?.roles?.includes("ADMIN") && (
                    <h3 className={HeaderStyles["header-link"]}>
                        <Link to="/manageUsers" className="RouterLink">Manage Users</Link>
                    </h3>
                )}
                {user?.roles?.includes("REVIEWER") || user?.roles?.includes("ADMIN") && (
                    <h3 className={HeaderStyles["header-link"]}>
                        <Link to="/versions/pendingReview" className="RouterLink">Review Versions</Link>
                    </h3>
                )}
            </div>

            <div className={HeaderStyles["right-side"]}>
                <div ref={searchRef} className={HeaderStyles["search-bar-container"]}>
                    <input
                        className={HeaderStyles["search-bar"]}
                        type="text"
                        onChange={(e) => setSearchResult(e.target.value)}
                        onFocus={(e) => setSearchResult(e.target.value)}
                        onBlur={() => setTimeout(() => setSearchResult(""), 200)}
                        placeholder="Search documents..."
                    />
                    
                    {searchResult !== "" && (
                        <div className={HeaderStyles["search-result-container"]}>
                            {allDocuments
                                .filter(doc => doc.title?.toLowerCase().includes(searchResult.toLowerCase()))
                                .map((doc) => (
                                    <SearchResult key={doc.id} id={doc.id} title={doc.title} />
                                ))
                            }
                        </div>
                    )}
                </div>
                <button className={HeaderStyles["upload-btn"]}>Upload</button>
                
                <div className={HeaderStyles["profile-pic"]} onClick={toggleMenu} tabIndex="0">
                    <UserRoundPen size={32} className={HeaderStyles["profile-pic-icon"]} />
                    {isMenuOpen && (
                        <div className={HeaderStyles["logout-menu"]}>
                            <span style={{padding: '5px 10px', fontSize: '12px', color: '#888'}}>
                                {user?.username}
                            </span>
                            <hr />
                            <button
                                onClick={() => { setIsMenuOpen(false); handleLogout(); }}
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