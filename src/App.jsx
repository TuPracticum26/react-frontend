import { useEffect, useState, StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import "./App.css";

function Test() {
    const [testMessage, SetTestMessage] = useState([]);
    
    useEffect(() => {
        async function testApi() {
            const response = await fetch("/api/v1/users");
            const data = await response.json();
            console.log(data);
            SetTestMessage(data);
            return data;
        }
        testApi();
    }, []);
    
    useEffect(() => {
        console.log(testMessage);
    }, [testMessage]);

    return (
        <>
            {testMessage.map((test, index) => (
                <div
                key={index}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: '1rem'
                }}
                >
                    <p>{test.id}</p>
                    <p>{test.username}</p>
                    <p>{test.role}</p>
                </div>
            ))}
        </>
    )

}


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Test/>
    </StrictMode>,
);