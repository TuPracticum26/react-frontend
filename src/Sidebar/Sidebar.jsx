import SidebarStyles from "./Sidebar.module.css";
import {
    Landmark,
    BookOpenText,
    SquarePen,
    ClipboardClock,
    BadgeCheck,
    FileStack,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Sidebar() {
    const token = JSON.parse(localStorage.getItem("token"));
    return (
        <aside>
            <div className={SidebarStyles["sidebar"]}>
                <Link to="/dashboard" className="RouterLink">
                    <div className={SidebarStyles["title"]}>
                        <Landmark className={SidebarStyles["title-icon"]} />
                        <div>
                            <h2 className={SidebarStyles["project"]}>
                                SAP Project
                            </h2>
                            <h6 className={SidebarStyles["app-name"]}>
                                D O C U M E N T &nbsp; M A N A G E R
                            </h6>
                        </div>
                    </div>
                </Link>
                <div className={SidebarStyles["links"]}>
                    <Link
                        to="/documents"
                        className={SidebarStyles["document-links"]}
                    >
                        <div className={SidebarStyles["link"]}>
                            <h2>
                                <BookOpenText className={SidebarStyles.icon} />{" "}
                                &nbsp; All Documents
                            </h2>
                        </div>
                    </Link>
                    {!token.roles.includes("READER") ? (
                        <>
                            <Link
                                to="/versions"
                                className={SidebarStyles["document-links"]}
                            >
                                <div className={SidebarStyles["link"]}>
                                    <h2>
                                        <FileStack
                                            className={SidebarStyles.icon}
                                        />{" "}
                                        &nbsp; Your versions
                                    </h2>
                                </div>
                            </Link>
                            <Link
                                to="/versions/drafts"
                                className={SidebarStyles["document-links"]}
                            >
                                <div className={SidebarStyles["link"]}>
                                    <h2>
                                        <SquarePen
                                            className={SidebarStyles.icon}
                                        />{" "}
                                        &nbsp; Drafts
                                    </h2>
                                </div>
                            </Link>
                            <Link
                                to="/versions/pending"
                                className={SidebarStyles["document-links"]}
                            >
                                <div className={SidebarStyles["link"]}>
                                    <h2>
                                        <ClipboardClock
                                            className={SidebarStyles.icon}
                                        />{" "}
                                        &nbsp; Pending Review
                                    </h2>
                                </div>
                            </Link>
                            <Link
                                to="/versions/approved"
                                className={SidebarStyles["document-links"]}
                            >
                                <div className={SidebarStyles["link"]}>
                                    <h2>
                                        <BadgeCheck
                                            className={SidebarStyles.icon}
                                        />{" "}
                                        &nbsp;Approved
                                    </h2>
                                </div>
                            </Link>
                        </>
                    ) : null}
                </div>
            </div>
        </aside>
    );
}
