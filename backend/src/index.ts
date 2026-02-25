import express, { Request, Response } from 'express';
import cors from 'cors';
import { JsonDB, Config } from 'node-json-db';
import fundsData from '../data/funds_data.json';

const app = express();
const port = process.env.PORT || 3000;

interface Fund {
  name: string;
  strategies: string[];
  geographies: string[];
  currency: string;
  fundSize: number;
  vintage: number;
  managers: string[];
  description: string;
}

app.use(cors());
app.use(express.json());

// Create database (creates db.json in project root)
const db = new JsonDB(
  new Config("db", true, true, "/")
);

async function initDB() {
  try {
    // 1. Try to fetch existing data
    let existingFunds: Fund[] = [];
    
    try {
      existingFunds = await db.getData("/funds");
    } catch (error) {
      // This error usually means the path "/funds" doesn't exist yet
      existingFunds = [];
    }

    // 2. STRICT CHECK: Only seed if it is NOT an array OR the length is 0
    if (!Array.isArray(existingFunds) || existingFunds.length === 0) {
      console.log("Database is empty. Seeding initial data...");
      await db.push("/funds", fundsData, true);
    } else {
      // 3. If length > 0, we do nothing.
      console.log(`Database already has ${existingFunds.length} entries. Skipping seed.`);
    }
  } catch (error) {
    console.error("Critical error during DB init:", error);
  }
}

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express + node-json-db!');
});

// Get all funds
app.get('/api/funds', async (req: Request, res: Response) => {
  try {
    const funds:Fund[] = await db.getData("/funds");
    res.status(200).json(funds);
  } catch (error) {
    res.status(200).json([]); // Return empty array if not found
  }
});

// GET fund by name
app.get("/api/funds/:name", async (req: Request, res: Response): Promise<void> => {
  try {
    const funds:Fund[] = await db.getData("/funds");
    const fundName = req.params.name.toLowerCase();

    const fund = funds.find((f: Fund) => f.name.toLowerCase() === fundName);

    if (!fund) {
      res.status(404).json({ message: "Fund not found" });
      return; // Just return to exit the function
    } 

    res.status(200).json(fund);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving fund" });
  }
});

// Add new fund
app.post('/api/funds', async (req: Request, res: Response) => {
  try {
    const funds:Fund[] = await db.getData("/funds").catch(() => []);
    const newFund = req.body;

    funds.push(newFund);

    await db.push("/funds", funds, true);

    res.status(201).json(newFund);
  } catch (error) {
    res.status(500).json({ message: "Error adding fund" });
  }
});

// Update an existing fund by name
app.put("/api/funds/:name", async (req: Request<{ name: string }, {}, Partial<Fund>>, res: Response): Promise<void> => {
  try {
    // 1. Fetch the current list of funds
    const funds: Fund[] = await db.getData("/funds");
    
    // 2. Find the index of the fund we want to update
    const targetName = decodeURIComponent(req.params.name).toLowerCase();
    const index = funds.findIndex(f => f.name.toLowerCase() === targetName);

    if (index === -1) {
      res.status(404).json({ message: `Fund '${req.params.name}' not found` });
      return;
    }

    // 3. Merge the existing fund data with the updates from req.body
    // Using the spread operator ensures we don't lose fields not present in the request
    const updatedFund = { ...funds[index], ...req.body };
    
    // Update the array at that specific index
    funds[index] = updatedFund;

    // 4. Save the updated array back to the DB
    await db.push("/funds", funds, true);

    res.status(200).json(updatedFund);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating fund" });
  }
});

//Delete Fund by name
app.delete("/api/funds/:name", async (req: Request, res: Response): Promise<void> => {
  try {
    const funds: Fund[] = await db.getData("/funds");
    const fundName = req.params.name.toLowerCase();
    
    const newFunds = funds.filter((f: any) => f.name.toLowerCase() !== fundName);

    if (funds.length === newFunds.length) {
      res.status(404).json({ message: "Fund not found" });
      return;
    }
    await db.push("/funds", newFunds, true);
    res.status(200).json({ message: "Fund deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fund" });
  }
});

// Start server AFTER DB init
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});