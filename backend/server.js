// server.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectcloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

await connectDB();
await connectcloudinary();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(clerkMiddleware());

app.get("/",(req,res)=>{ res.send("Hello World!");})
app.post("/clerk",express.json(),clerkWebhooks)
app.use("/api/educator",express.json(),educatorRouter)
app.use("/api/course",express.json(),courseRouter)
app.use("/api/user",express.json(),userRouter)
app.post("/stripe", express.raw({type: 'application/json'}), stripeWebhooks)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})