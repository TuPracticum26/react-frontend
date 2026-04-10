import DashboardStyles from "./Dashboard.module.css";
import useGetDocuments from "../hooks/useGetDocuments";
import Task from "../Task/Task";
import { Link } from "@tanstack/react-router";
import {
    FileText,
    ClipboardClock,
    CircleSlash,
    ClockArrowUp,
    ClipboardList,
    Activity,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const token = JSON.parse(localStorage.getItem("token"));
    const documents = useGetDocuments();
    const [userDocumentsVersions, setUserDocumentsVersions] = useState([]);
    const [allDocumentsVersions, setAllDocumentsVersions] = useState([]);
    const [pendingDocument, setPendingDocuments] = useState(0);
    const [rejectedDocuments, setRejectedDocuments] = useState(0);
    const recentUserVersions = userDocumentsVersions
        .sort(sortByLatestVersion)
        .reverse()
        .slice(0, 3);
    const latestChange = recentUserVersions[0];
    const recentAllVersions = allDocumentsVersions
        .sort(sortByLatestVersion)
        .reverse()
        .slice(0, 5);
    useEffect(() => {
        getUserData();
        return () => {
            setUserDocumentsVersions([]);
        };
    }, [documents]);

    async function getUserData() {
        const allUserVersions = await Promise.all(
            documents.map(async (document) => {
                const { userVersionArray } = await getUserVersions(document.id);
                return userVersionArray;
            }),
        );
        const userVersions = allUserVersions.flat();
        setUserDocumentsVersions(userVersions);

        const allVersions = await Promise.all(
            documents.map(async (document) => {
                const { allVersionArray } = await getUserVersions(
                    document.id,
                    "all",
                );
                return allVersionArray;
            }),
        );
        const setAllVersions = allVersions.flat();
        setAllDocumentsVersions(setAllVersions);
    }

    async function getUserVersions(docId, whichDocuments) {
        const userVersionArray = [];
        const allVersionArray = [];
        const res = await fetch(`/api/v1/documents/${docId}/history`);
        const data = await res.json();
        const versions = data.versions;

        if (whichDocuments == "all") {
            versions.map((version) => {
                allVersionArray.push(version);
            });
        }

        versions.map((version) => {
            if (version.createdByUsername == token.username) {
                userVersionArray.push(version);
            }
        });
        return { userVersionArray, allVersionArray };
    }

    useEffect(() => {
        setPendingDocuments(getTypeDocuments(userDocumentsVersions, "PENDING"));
        setRejectedDocuments(
            getTypeDocuments(userDocumentsVersions, "REJECTED"),
        );
    }, [userDocumentsVersions]);

    function getTypeDocuments(userDocuments = [], type) {
        let typeOfDocuments = 0;
        userDocuments.map((document) => {
            if (document.status == type) {
                typeOfDocuments++;
            }
        });
        return typeOfDocuments;
    }

    function sortByLatestVersion(a, b) {
        if (a.createdAt.slice(0, 10) < b.createdAt.slice(0, 10)) {
            return -1;
        }
        if (a.createdAt.slice(0, 10) > b.createdAt.slice(0, 10)) {
            return 1;
        }
        return 0;
    }

    function HeroCard({ children, title, number, content }) {
        return (
            <div
                className={
                    DashboardStyles[
                        content ? "hero-card-latest-change" : "hero-card"
                    ]
                }
            >
                <div>{children}</div>
                <p>{title}</p>
                <h2>{number}</h2>
                {content ? (
                    <p className={DashboardStyles["latest-change-content"]}>
                        {content}
                    </p>
                ) : null}
            </div>
        );
    }

    return (
        <div className={DashboardStyles.dashboard}>
            <div className={DashboardStyles["legend"]}>
                <h1>SAP Documents</h1>
                <p>
                    A centralized platform for submitting, reviewing, and
                    managing documents. Keep track of approvals, rejections, and
                    updates to ensure a smooth and efficient workflow.
                </p>
            </div>
            <div className={DashboardStyles["hero-card-container"]}>
                <HeroCard title={"Active Documents"} number={documents.length}>
                    <div
                        style={{ backgroundColor: "rgb(230, 235, 241)" }}
                        className={DashboardStyles["hero-card-icon"]}
                    >
                        <FileText
                            size={"40px"}
                            color="var(--logo-color)"
                            className={DashboardStyles["hero-card-icon"]}
                        />
                    </div>
                </HeroCard>
                <HeroCard title={"Pending Approvals"} number={pendingDocument}>
                    <div
                        style={{ backgroundColor: "rgb(172, 244, 190)" }}
                        className={DashboardStyles["hero-card-icon"]}
                    >
                        <ClipboardClock
                            size={"40px"}
                            color="rgb(18, 69, 36)"
                            className={DashboardStyles["hero-card-icon"]}
                        />
                    </div>
                </HeroCard>
                <HeroCard
                    title={"Rejected Documents"}
                    number={rejectedDocuments}
                >
                    <div
                        style={{ backgroundColor: "rgb(249, 219, 215)" }}
                        className={DashboardStyles["hero-card-icon"]}
                    >
                        <CircleSlash
                            size={"40px"}
                            color="rgb(134, 25, 21)"
                            className={DashboardStyles["hero-card-icon"]}
                        />
                    </div>
                </HeroCard>
                <Link to={`documents/${latestChange?.documentId ?? 1}`}>
                    <HeroCard
                        title={"Latest Change"}
                        number={latestChange?.createdAt?.slice(0, 10) ?? null}
                        content={
                            (latestChange?.content?.length ?? 0 > 35)
                                ? latestChange.content.slice(0, 35) + "…"
                                : (latestChange?.content ?? null)
                        }
                    >
                        <div
                            style={{ backgroundColor: "rgb(249, 245, 215)" }}
                            className={DashboardStyles["hero-card-icon"]}
                        >
                            <ClockArrowUp
                                size={"40px"}
                                color="rgb(134, 115, 21)"
                                className={DashboardStyles["hero-card-icon"]}
                            />
                        </div>
                    </HeroCard>
                </Link>
            </div>
            <div className={DashboardStyles["personal-activity"]}>
                <h2>
                    <ClipboardList size={"28px"} />
                    Recent Personal Tasks
                </h2>
                <div className={DashboardStyles["tasks-container"]}>
                    {recentUserVersions.map((version) => (
                        <Task key={version.id} version={version} />
                    ))}
                </div>
            </div>
            <div className={DashboardStyles["team-activity"]}>
                <h2>
                    <Activity size={"28px"} /> Recent Team Activity
                </h2>
                <div className={DashboardStyles["tasks-container"]}>
                    {recentAllVersions.map((version) => (
                        <Task key={version.id} version={version} />
                    ))}
                </div>
            </div>
        </div>
    );
}
