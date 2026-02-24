import express, { Request, Response } from 'express';
import cors from 'cors';
import fundsData from "../data/funds_data.json";

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.get("/api/funds", (req: Request, res: Response) => {
  res.status(200).json(fundsData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});