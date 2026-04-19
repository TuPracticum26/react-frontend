import DocumentImage from "../../public/Home_Document.png";

export default function Home() {
    // Вече не ни трябва проверка за token тук, рутерът в __root.jsx се грижи за това.
    // Така Header-ът и Sidebar-ът ще са винаги видими около този компонент.

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "var(--hover-color)", // Използваме твоя цвят от темата
                padding: "2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h1 style={{ color: "var(--logo-color)", fontSize: "2.5rem", margin: 0 }}>
                    Welcome to the Document Manager App
                </h1>
                
                <h2 style={{ fontWeight: "400", color: "#555", maxWidth: "600px" }}>
                    Navigate through the menus to read/write/alter Documents!
                </h2>

                <div
                    style={{
                        backgroundColor: "var(--secondary-color-soft)",
                        borderRadius: "50%", // Правим перфектен кръг
                        width: "550px",
                        height: "550px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                >
                    <img
                        src={DocumentImage}
                        alt="Home Document"
                        style={{ 
                            maxWidth: "400px", 
                            height: "auto",
                            filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.1))" 
                        }}
                    />
                </div>
            </div>
        </div>
    );
}