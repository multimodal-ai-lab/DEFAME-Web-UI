const express = require('express');
const contentRouter = require("./routes/content.router");
const cors = require("cors");
const resultRouter = require('./routes/results.router');
const connectDB = require("./db");

const PORT = 3000;

const app = express();

connectDB();

// Increase request size limit (default is 100kb)
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

// Routes
app.get('/', (req, res) => {
    res.send('server running');
});

app.use(contentRouter);
app.use("/results", resultRouter);

// Listen on 0.0.0.0 (Docker compatible)
app.listen(PORT ,"0.0.0.0",() => {
    console.log(`Server running at http://localhost:${PORT}`);
});
