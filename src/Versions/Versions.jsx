import VersionsStyles from "./Versions.module.css";
import Task from "../Task/Task";
import { useState, useEffect, use } from "react";
import getUserVersions from "../hooks/useGetUserVersions"; 
import getTeamVersions from "../hooks/useGetTeamVersions";
import useGetAllPendingVersions from "../hooks/useGetAllPendingVersions";
import { getUser } from "../utils/auth";
import { FileTerminal } from "lucide-react";

export default function Versions({
    versionsPage = [],
    page = 0,
    setPage = () => {},
    functionality,
}) {
    const [allUserVersions, setAllUserVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState("");
    const [pendingVersions, setPendingVersions] = useState([]);
    const allPendingVersions = useGetAllPendingVersions();
    const [allTeamVersions, setAllTeamVersions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const userVersionArray = await getUserVersions("all");
            functionality && functionality === "Review" && setPendingVersions(await useGetAllPendingVersions());
            setAllUserVersions(userVersionArray);
            setIsLoading(false);
        };
        loadData();
    }, []);

    let displayedVersions = functionality === "Review" ? versionsPage : allUserVersions ?? ["no versions"];

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
                if (allUserVersions) {
                    displayedVersions = allUserVersions.filter(v => v.status === targetStatus);
                }
            }
        }
    }
    

    let filteredVersions = functionality !== "" ?
        functionality == "Team" ? 
            !searchResult ? versionsPage :
            allTeamVersions.filter(version => {
            if (!searchResult) return true;
            const searchLower = searchResult.toLowerCase();
            return (
                version.title?.toLowerCase().includes(searchLower) || 
                version.id?.toString() === searchResult
            );
        }) :
        functionality == "Review" ? 
            !searchResult ? versionsPage :
            pendingVersions.filter(version => {
            if (!searchResult) return true;
            const searchLower = searchResult.toLowerCase();
            return (
                version.title?.toLowerCase().includes(searchLower) || 
                version.id?.toString() === searchResult
            );
        })
        : displayedVersions.filter(version => {
            if (!searchResult) return true;
            const searchLower = searchResult.toLowerCase();
            return (
                version.title?.toLowerCase().includes(searchLower) || 
                version.id?.toString() === searchResult
            );
        }) : null;

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
                {filteredVersions?.length?? 0 > 0 ? (
                    filteredVersions.map((version) => (
                        <Task version={version} key={version.id} />
                    ))
                ) : (
                    <p>No versions found.</p>
                )}
            </div>

            {searchResult === "" && (functionality === "Team" || functionality === "Review") && (
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