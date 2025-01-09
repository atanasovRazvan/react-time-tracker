import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import RouteTimeTracker from "./RouteTimeTracker";

const Home = () => (
    <div style={{ padding: "20px" }}>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of our React app. You can navigate to the About page using the button below.</p>
        <Link to="/about">
            <button style={{ padding: "10px 20px", fontSize: "16px" }}>Go to About</button>
        </Link>
    </div>
);

const About = () => (
    <div style={{ padding: "20px" }}>
        <h1>About Us</h1>
        <p>This is the About page. Learn more about our project here. You can return to the Home page using the button below.</p>
        <Link to="/">
            <button style={{ padding: "10px 20px", fontSize: "16px" }}>Go to Home</button>
        </Link>
    </div>
);

const App = () => {
    return (
        <Router>
            <RouteTimeTracker>
                <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </RouteTimeTracker>
        </Router>
    );
};

const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)