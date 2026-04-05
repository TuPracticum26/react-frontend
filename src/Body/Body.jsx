import Sidebar from "../Sidebar/Sidebar.jsx"
import { useState, useEffect } from "react";
import BodyStyles from './Body.module.css'

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
        <div
        style={{
            display: "flex",
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: "center",
            gap: '1rem'
        }}
        >
            {testMessage.map((test, index) => (
                <div key={index}>
                    <p>{test.id}</p>
                    <p>{test.username}</p>
                    <p>{test.role}</p>
                </div>
            ))}
        </div>
    )

}

export default function Body() {

    return (
        <div className={BodyStyles["body"]}>
            <Sidebar />
            <Test />
        </div>
    )

}