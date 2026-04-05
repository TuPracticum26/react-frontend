import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { StrictMode } from "react";
import Header from "../Header/Header";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Test from "./Test";
import "../App/App.css";
import Home from "../Pages/Home.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}