import TaskStyles from "./Task.module.css";
import { Link } from "@tanstack/react-router";
import { ClipboardCheck, ClipboardPen, ClipboardX } from "lucide-react";

export default function Task({ version }) {
    const TITLE_WIDTH = 60;
    const NAME_WIDTH = 25;

    const displayTitle = version.title || "Untitled Document";

    return (
        <Link to={`/documents/${version.documentId}/versions/${version.versionNumber}`}>
            <div
                className={`${TaskStyles["task"]} ${
                    version.status === "APPROVED" 
                        ? TaskStyles["shadow-approved"] 
                        : version.status === "REJECTED" 
                        ? TaskStyles["shadow-rejected"] 
                        : TaskStyles["shadow-pending"]
                }`}
            >
                <div className={TaskStyles["task-icon-text"]}>
                    <div className={TaskStyles["task-icon"]}>
                        {version.status === "APPROVED" ? (
                            <ClipboardCheck size={"32px"} />
                        ) : version.status === "REJECTED" ? (
                            <ClipboardX size={"32px"} />
                        ) : (
                            <ClipboardPen size={"32px"} />
                        )}
                    </div>
                    <div className={TaskStyles["task-title-date"]}>
                        <h3>
                            {displayTitle.length > TITLE_WIDTH
                                ? displayTitle.slice(0, TITLE_WIDTH) + "…"
                                : displayTitle}{" "}
                            •{" "}
                            {version.createdByUsername.length > NAME_WIDTH
                                ? version.createdByUsername.slice(0, NAME_WIDTH) + "…"
                                : version.createdByUsername}
                        </h3>
                        <p>{version.createdAt.slice(0, 10)}</p>
                    </div>
                </div>
                <h5
                    className={`${TaskStyles["task-status"]} ${
                        version.status === "APPROVED" 
                            ? TaskStyles["status-approved"] 
                            : version.status === "REJECTED" 
                            ? TaskStyles["status-rejected"] 
                            : TaskStyles["status-pending"]
                    }`}
                >
                    {version.status}
                </h5>
            </div>
        </Link>
    );
}