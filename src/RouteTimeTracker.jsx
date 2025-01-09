import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const IDLE_TIMEOUT = 10000;

const RouteTimeTracker = ({ children }) => {
    const location = useLocation();
    const previousRoute = useRef(null);
    const startTime = useRef(null);
    const totalActiveTime = useRef(0);
    const lastActiveTime = useRef(null);
    const isIdle = useRef(false);
    const idleTimeout = useRef(null);
    const isUnmounting = useRef(false);

    useEffect(() => {
        const currentRoute = location.pathname;

        if (previousRoute.current && !isUnmounting.current) {
            // Send data for the previous route
            calculateActiveTime();
            sendSessionData(previousRoute.current, totalActiveTime.current);
        }

        // Reset tracking for the new route
        previousRoute.current = currentRoute;
        startTime.current = Date.now();
        totalActiveTime.current = 0;
        lastActiveTime.current = Date.now();

        const resetIdleTimer = () => {
            if (isIdle.current) {
                console.log("Resuming from idle.");
                isIdle.current = false;
                lastActiveTime.current = Date.now(); // Reset the active timestamp
            }

            clearTimeout(idleTimeout.current);
            idleTimeout.current = setTimeout(() => {
                console.log("User is idle.");
                calculateActiveTime(); // Add the time before going idle
                isIdle.current = true;
            }, IDLE_TIMEOUT);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log("Tab is inactive. Tracking paused.");
                calculateActiveTime(); // Add active time before going inactive
                isIdle.current = true; // Treat as idle while hidden
            } else {
                console.log("Tab is active.");
                isIdle.current = false;
                lastActiveTime.current = Date.now(); // Reset the active timestamp
            }
        };

        const handleSessionEnd = (event) => {
            event.preventDefault();
            // Mark the component as unmounting
            isUnmounting.current = true;
            // Save and send the current route's time when the session ends
            if (previousRoute.current) {
                calculateActiveTime();
                sendSessionData(previousRoute.current, totalActiveTime.current);
            }
            event.returnValue = ''; // Chrome requires this to trigger the confirmation dialog
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("mousemove", resetIdleTimer);
        window.addEventListener("keydown", resetIdleTimer);
        window.addEventListener("scroll", resetIdleTimer);
        window.addEventListener("beforeunload", handleSessionEnd);

        resetIdleTimer(); // Start the idle timer

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("mousemove", resetIdleTimer);
            window.removeEventListener("keydown", resetIdleTimer);
            window.removeEventListener("scroll", resetIdleTimer);
            window.removeEventListener("beforeunload", handleSessionEnd);
            clearTimeout(idleTimeout.current);
            isUnmounting.current = false;
        };
    }, [location]);

    const calculateActiveTime = () => {
        if (!isIdle.current && lastActiveTime.current) {
            totalActiveTime.current += Date.now() - lastActiveTime.current;
        }
        lastActiveTime.current = Date.now();
    };

    // API call for testing and integration purposes
    const sendSessionData = (route, timeSpent) => {
        if (!route || timeSpent <= 0) return;

        fetch("http://localhost:3000/api/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ route, timeSpent }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Session data sent successfully:", data);
            })
            .catch((error) => {
                console.error("Error sending session data:", error);
            });
    };

    return children;
};

export default RouteTimeTracker;
