import { Pool } from "pg";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
});

// Middleware
app.use(express.json())

app.get('/test', (req, res)=>{
    res.send('Hello world!')
})

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is Running at Port ${port}`));
