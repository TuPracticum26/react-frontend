import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import Header from "../Header/Header";
import Body from "../Body/Body";
import "./App.css";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Header />
        <Body />
    </StrictMode>,
);