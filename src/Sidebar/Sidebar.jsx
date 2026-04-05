import SidebarStyles from "./Sidebar.module.css";
import {
    Landmark,
    BookOpenText,
    SquarePen,
    ClipboardClock,
    BadgeCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Sidebar() {
    return (
        <aside>
            <div className={SidebarStyles["sidebar"]}>
                <Link to="/" className="RouterLink">
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
                    <div className={SidebarStyles["link"]}>
                        <Link to="/documents" className="RouterLink">
                            <h3>
                                <BookOpenText className={SidebarStyles.icon} />{" "}
                                &nbsp; All Documents
                            </h3>
                        </Link>
                    </div>
                    <div className={SidebarStyles["link"]}>
                        <h3>
                            <SquarePen className={SidebarStyles.icon} /> &nbsp;
                            Drafts
                        </h3>
                    </div>
                    <div className={SidebarStyles["link"]}>
                        <h3>
                            <ClipboardClock className={SidebarStyles.icon} />{" "}
                            &nbsp; Pending Review
                        </h3>
                    </div>
                    <div className={SidebarStyles["link"]}>
                        <h3>
                            <BadgeCheck className={SidebarStyles.icon} />{" "}
                            &nbsp;Approved
                        </h3>
                    </div>
                </div>
            </div>
        </aside>
    );
}
