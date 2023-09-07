import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/*", function (req, res) {
  res.sendFile(req.pathpath.join(_dirname, "../dex/build/index.html"),
  function(err){
    if(err){
      res.status(500).send(err);
    }
  })
})

// Connection URL and Database Name
const url = process.env.REACT_APP_MONGODB_URI;
const dbName = 'gridlockDb'; // Replace this with your desired database name

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Connect to the server
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the connect function
connect();

// API route to add a token to the watchlist or create a new user with the token
app.post('/api/addToWatchlist', (req, res) => {
  const { address, uuid } = req.body;
  const db = client.db(dbName);
  console.log('Received address:', address);
  console.log('Received uuid:', uuid);
  db.collection('users')
    .findOne({ user: address })
    .then((user) => {
      if (user) {
        db.collection('users').updateOne({ user: address }, { $addToSet: { uuid: uuid } });
      } else {
        db.collection('users').insertOne({ user: address, uuid: [uuid] });
      }
      res.json({ message: 'Token added to watchlist!' });
    })
    .catch((error) => {
      console.error('Error adding token to watchlist:', error);
      res.status(500).json({ error: 'An error occurred while adding the token to watchlist.' });
    });
});

// API route to remove a token from the watchlist
app.post('/api/removeFromWatchlist', (req, res) => {
  const { address, uuid } = req.body;
  console.log('Received address:', address);
  console.log('Received uuid:', uuid);
  const db = client.db(dbName);
  db.collection('users')
    .updateOne({ user: address }, { $pull: { uuid: uuid } })
    .then((result) => {
      res.json({ message: 'Token removed from watchlist!' });
    })
    .catch((error) => {
      console.error('Error removing token from watchlist:', error);
      res.status(500).json({ error: 'An error occurred while removing the token from watchlist.' });
    });
});


// API route to get data from MongoDB
app.get('/api/data', async (req, res) => {
  try {
    const user = req.query.user
    const db = client.db(dbName);
    const collection = db.collection('users');
    const query = {["user"]: user};
    const result = await collection.find(query).toArray();

    res.json(result);
  } catch (error) {
    console.error('Error getting data from MongoDB:', error);
    res.status(500).json({ error: 'Failed to get data from MongoDB' });
  }
});

// Start the server on a specified port (e.g., 3000)
const PORT = process.env.port || 3005;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});