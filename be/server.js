const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post("/api/session", (req, res) => {
    const { route, timeSpent } = req.body;
    if (!route || !timeSpent) {
        return res.status(400).send("Missing route or timeSpent in the request body.");
    }
    console.log("Session Data Received:");
    console.log(`Route: ${route}`);
    console.log(`Time Spent: ${timeSpent} ms`);
    res.status(200).send("Session data logged successfully.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
