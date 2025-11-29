import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { connectDB } from "./config/connectDb.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    return res.status(200).json({ success: true, message: "Server is running..." });
});

async function main() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is ruung at: http://localhost:${PORT}`);
    })
}
main();