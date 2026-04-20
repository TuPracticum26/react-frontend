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
import { Spinner } from "@radix-ui/themes";
import { getUser, getToken } from "../utils/auth"; 

export default function Dashboard() {
    const user = getUser();
    const { documents, loading: docsLoading } = useGetDocuments(); // Приемаме, че хукът връща и loading
    
    const [userDocumentsVersions, setUserDocumentsVersions] = useState([]);
    const [allDocumentsVersions, setAllDocumentsVersions] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Безопасно сортиране
    const recentUserVersions = [...userDocumentsVersions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const latestChange = recentUserVersions[0];

    useEffect(() => {
        // Стартираме само ако имаме документи и не зареждаме в момента
        if (documents && documents.length > 0 && user && !isLoadingData) {
            getUserData();
        }
    }, [documents]); // Махаме 'user' от депенденситата, за да не цикли

    async function getUserData() {
        const tokenString = getToken();
        if (!tokenString) return;

        setIsLoadingData(true);
        try {
            const allPromises = documents.map(doc => 
                fetch(`/api/v1/documents/${doc.id}/history`, {
                    headers: {
                        Authorization: `Bearer ${tokenString}`,
                        "Content-Type": "application/json",
                    },
                }).then(res => res.ok ? res.json() : null)
            );

            const histories = await Promise.all(allPromises);
            
            const allVers = [];
            const userVers = [];

            histories.forEach(data => {
                if (data && (Array.isArray(data) || data.versions)) {
                    const versionsList = Array.isArray(data) ? data : data.versions;
                    versionsList.forEach(v => {
                        allVers.push(v);
                        if (v.createdByUsername === user.username || v.authorUsername === user.username) {
                            userVers.push(v);
                        }
                    });
                }
            });

            setAllDocumentsVersions(allVers);
            setUserDocumentsVersions(userVers);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setIsLoadingData(false);
        }
    }

    // Помощна функция за броене
    const getCount = (status) => userDocumentsVersions.filter(v => v.status === status).length;
    const recentAllVersions = [...allDocumentsVersions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 9);

    if (docsLoading || isLoadingData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner size="3" />
                <p style={{ marginLeft: '10px' }}>Зареждане на таблото...</p>
            </div>
        );
    }

    return (
        <div className={DashboardStyles.dashboard}>
            <div className={DashboardStyles["legend"]}>
                <h1>SAP Documents</h1>
                <p>Welcome back, <strong>{user?.username}</strong>!</p>
            </div>
            
            <div className={DashboardStyles["hero-card-container"]}>
                <Link to="/documents">
                    <HeroCard title="Active Documents" number={documents?.length}>
                        <div className={DashboardStyles["hero-card-icon"]} style={{ backgroundColor: "#e6ebf1" }}>
                            <FileText size="40px" color="#2b5a9e" />
                        </div>
                    </HeroCard>
                </Link>

                <Link to="/versions/pending">
                    <HeroCard title="Pending Approvals" number={getCount("PENDING")}>
                        <div className={DashboardStyles["hero-card-icon"]} style={{ backgroundColor: "#acf4be" }}>
                            <ClipboardClock size="40px" color="#124524" />
                        </div>
                    </HeroCard>
                </Link>

                <Link to="/versions/rejected">
                    <HeroCard title="Rejected Documents" number={getCount("REJECTED")}>
                        <div className={DashboardStyles["hero-card-icon"]} style={{ backgroundColor: "#f9dbd7" }}>
                            <CircleSlash size="40px" color="#861915" />
                        </div>
                    </HeroCard>
                </Link>

                <HeroCard 
                    title="Latest Change" 
                    number={latestChange?.createdAt ? new Date(latestChange.createdAt).toLocaleDateString() : "N/A"}
                    content={latestChange?.content ? latestChange.content.replace(/<[^>]*>/g, '').substring(0, 35) + "..." : "No recent changes"}
                >
                    <div className={DashboardStyles["hero-card-icon"]} style={{ backgroundColor: "#f9f5d7" }}>
                        <ClockArrowUp size="40px" color="#867315" />
                    </div>
                </HeroCard>
            </div>

            <div className={DashboardStyles["personal-activity"]}>
                <h2><ClipboardList size="28px" /> Recent Personal Tasks</h2>
                <div className={DashboardStyles["tasks-container"]}>
                    {recentUserVersions.length > 0 ? (
                        recentUserVersions.map(v => <Task key={v.id} version={v} />)
                    ) : <p>No recent activity found.</p>}
                </div>
            </div>

            <div className={DashboardStyles["team-activity"]}>
                <h2><Activity size="28px" /> Recent Team Activity</h2>
                <div className={DashboardStyles["tasks-container"]}>
                    {recentAllVersions.length > 0 ? (
                        recentAllVersions.map(v => (
                            <Task 
                                key={v.id} 
                                version={v} 
                                showAuthor={true} // Можеш да добавиш проп, за да показваш кой е направил промяната
                            />
                        ))
                    ) : <p>No team activity recorded.</p>}
                </div>
            </div>
        </div>
    );
}

// HeroCard остава същия...
function HeroCard({ children, title, number, content }) {
    return (
        <div className={DashboardStyles[content ? "hero-card-latest-change" : "hero-card"]}>
            <div>{children}</div>
            <p>{title}</p>
            <h2>{number ?? 0}</h2>
            {content && <p className={DashboardStyles["latest-change-content"]}>{content}</p>}
        </div>
    );
}