import VersionsStyles from "./Versions.module.css";
import Task from "../Task/Task";
import { useState, useEffect } from "react";
import getUserVersions from "../hooks/useGetUserVersions"; 
import { getUser } from "../utils/auth";

export default function Versions({
    versionsPage = [], // Данни от родителя (ако има такива)
    page = 0,
    setPage = () => {},
    functionality,
    docId // Трябва да подадеш docId на този компонент
}) {
    const [allUserVersions, setAllUserVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState("");

    // Зареждане на данните при монтиране
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const userVersionArray = await getUserVersions("all");
            setAllUserVersions(userVersionArray);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Логика за филтриране
    let displayedVersions = allUserVersions;

    if (functionality) {
        if (functionality === "Team") {
            displayedVersions = versionsPage;
        } else {
            const statusMap = {
                "Draft": "DRAFT",
                "Approved": "APPROVED",
                "Rejected": "REJECTED",
                "Pending": "PENDING"
            };
            const targetStatus = statusMap[functionality];
            if (targetStatus) {
                displayedVersions = allUserVersions.filter(v => v.status === targetStatus);
            }
        }
    }

    // Прилагане на търсенето
    const filteredVersions = displayedVersions.filter(version => {
        if (!searchResult) return true;
        const searchLower = searchResult.toLowerCase();
        return (
            version.content?.toLowerCase().includes(searchLower) || 
            version.id?.toString() === searchResult
        );
    });

    if (isLoading) return <div className="loading">Loading versions...</div>;

    return (
        <div className={VersionsStyles["versions-component"]}>
            <h1>Browse {functionality ? functionality : "your"} versions</h1>
            
            <input
                className={VersionsStyles["search-bar"]}
                type="text"
                value={searchResult}
                onChange={(e) => setSearchResult(e.target.value)}
                placeholder="Search version content or ID..."
            />

            <div className={VersionsStyles["version-card-container"]}>
                {filteredVersions.length > 0 ? (
                    filteredVersions.map((version) => (
                        <Task version={version} key={version.id} />
                    ))
                ) : (
                    <p>No versions found.</p>
                )}
            </div>

            {/* Пагинация само за Team секцията */}
            {searchResult === "" && functionality === "Team" && (
                <div className={VersionsStyles["page-buttons-container"]}>
                    <button
                        disabled={page <= 0}
                        onClick={() => setPage(page - 1)}
                        className={VersionsStyles["page-button"]}
                    >
                        Prev
                    </button>
                    <button
                        disabled={versionsPage.length < 10}
                        onClick={() => setPage(page + 1)}
                        className={VersionsStyles["page-button"]}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}