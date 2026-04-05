import {useEffect, useState} from "react";
import HeaderStyles from "../Header/Header.module.css";

export default function Test() {
    const [testMessage, SetTestMessage] = useState([]);
    const token = localStorage.getItem('token');

    if(!token) return (
        <div style = {{ textAlign: "center", marginTop: "100px" }}>
            <h2>You are not logged in!</h2>
            <p>Please log in to access your documents.</p>

            <button className={HeaderStyles["upload-btn"]} onClick={() => navigate("/login")}>Login</button>
            <button className={HeaderStyles["upload-btn"]} onClick={() => navigate("/register")}>Register</button>
        </div>
    )

    useEffect(() => {
        async function testApi() {
            const response = await fetch("/api/v1/users");
            const data = await response.json();
            console.log(data);
            SetTestMessage(data);
            return data;
        }
        //testApi();
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