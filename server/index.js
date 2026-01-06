const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { PORT, CLIENT_URL } = require("./config/config");
const morgan = require("morgan");
const { connectDB } = require("./lib/db");

const routes = require("./routes/index");
const { connectSocket } = require("./lib/socket");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: "https://viby-chat-app.vercel.app",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(routes);

connectDB();
connectSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
