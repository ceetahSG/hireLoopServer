import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-p4mwva5-shard-00-00.tiw02ei.mongodb.net:27017,ac-p4mwva5-shard-00-01.tiw02ei.mongodb.net:27017,ac-p4mwva5-shard-00-02.tiw02ei.mongodb.net:27017/?ssl=true&replicaSet=atlas-8cmt6h-shard-0&authSource=admin`,
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const ConnectedClient = await connectToMongoDB();
const database = ConnectedClient.db("hireLoopDb");
const usersCollection = database.collection("user");
const jobsCollection = database.collection("job");

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const cursor = usersCollection.find({});
  const users = await cursor.toArray();
  res.send(users);
});

app.post("/jobs", async (req, res) => {
  const job = req.body;
  const result = await jobsCollection.insertOne(job);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
