import VersionsStyles from "./Versions.module.css";
import Task from "../Task/Task";
import { useState } from "react";
import useGetUserVersion from "../hooks/useGetUserVersions";

export default function Versions({
    versionsPage = [],
    page = [],
    setPage = () => {},
    functionality,
}) {
    const token = JSON.parse(localStorage.getItem("token"));
    const allUserVersions = useGetUserVersion(token.id);

    let copyOfAllUserVersions = allUserVersions;

    if (functionality) {
        if (functionality == "Draft") {
            copyOfAllUserVersions = copyOfAllUserVersions.filter(
                (version) => version.status == "DRAFT",
            );
        }
        if (functionality == "Approved") {
            copyOfAllUserVersions = copyOfAllUserVersions.filter(
                (version) => version.status == "APPROVED",
            );
        }
        if (functionality == "Rejected") {
            copyOfAllUserVersions = copyOfAllUserVersions.filter(
                (version) => version.status == "REJECTED",
            );
        }
        if (functionality == "Pending") {
            copyOfAllUserVersions = copyOfAllUserVersions.filter(
                (version) => version.status == "PENDING",
            );
        }
    }

    const [searchResult, setSearchResult] = useState("");

    return (
        <div className={VersionsStyles["versions-component"]}>
            <h1>Browse your versions</h1>
            <input
                autoFocus={true}
                className={VersionsStyles["search-bar"]}
                type="text"
                onChange={(e) => {
                    setSearchResult(e.target.value);
                }}
                onFocus={(e) => {
                    setSearchResult(e.target.value);
                }}
                placeholder="Search version..."
            />
            <div className={VersionsStyles["version-card-container"]}>
                {!functionality ? (
                    searchResult != "" ? (
                        <>
                            {copyOfAllUserVersions.map((version) => {
                                if (
                                    version.content
                                        .toLowerCase()
                                        .includes(searchResult.toLowerCase()) ||
                                    searchResult == version.id
                                ) {
                                    return (
                                        <Task
                                            version={version}
                                            key={version.id}
                                        />
                                    );
                                }
                            })}
                        </>
                    ) : (
                        <>
                            {versionsPage.map((version) => (
                                <Task version={version} key={version.id} />
                            ))}
                        </>
                    )
                ) : (
                    copyOfAllUserVersions.map((version) => {
                        if (
                            version.content
                                .toLowerCase()
                                .includes(searchResult.toLowerCase()) ||
                            searchResult == version.id
                        ) {
                            return <Task version={version} key={version.id} />;
                        }
                    })
                )}
            </div>
            {searchResult == "" && !functionality ? (
                <div className={VersionsStyles["page-buttons-container"]}>
                    <button
                        disabled={page <= 0}
                        onClick={() => setPage(page - 1)}
                        className={VersionsStyles["page-button"]}
                    >
                        Prev
                    </button>
                    <button
                        disabled={versionsPage.length < 2}
                        onClick={() => setPage(page + 1)}
                        className={VersionsStyles["page-button"]}
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
}
