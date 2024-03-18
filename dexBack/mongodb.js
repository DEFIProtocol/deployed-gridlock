import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();
app.use(express.json());
app.use(cors(FRONTEND_URL));

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
// API route to add/update a token in the tokens collection
app.post('/api/tokens', async (req, res) => {
  try {
    const { uuid, chains, creatorAddress, Announcements, adminAddresses, description, maxSupply, circulatingSupply, website, name, symbol, iconUrl, type, secRegistered, votingEnabled } = req.body;
    const db = client.db(dbName);
    const existingToken = await db.collection('tokens').findOne({ uuid });

    if (existingToken) {
      await db.collection('tokens').updateOne({ uuid }, {
        $set: {
          uuid, chains, creatorAddress, Announcements, adminAddresses, description, maxSupply, circulatingSupply, website, name, symbol, iconUrl, type, secRegistered, votingEnabled
        }
      });
    } else {
      await db.collection('tokens').insertOne({
        uuid, chains, creatorAddress, Announcements, adminAddresses, description, maxSupply, circulatingSupply, website, name, symbol, iconUrl, type, secRegistered, votingEnabled
      });
    }

    res.status(200).json({ message: 'Token added/updated successfully' });
  } catch (error) {
    console.error('Error adding/updating token:', error);
    res.status(500).json({ error: 'An error occurred while adding/updating the token.' });
  }
});

// API route to get a token from the tokens collection by uuid
app.get('/api/tokens/:uuid', async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const db = client.db(dbName);
    const token = await db.collection('tokens').findOne({ uuid });

    if (!token) {
      res.status(404).json({ error: 'Token not found' });
      return;
    }

    res.status(200).json(token);
  } catch (error) {
    console.error('Error getting token:', error);
    res.status(500).json({ error: 'An error occurred while getting the token.' });
  }
});

//Proxy Server for market buy and sell
const axiosHeaders = { // Define the required headers here
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.YOUR_1INCH_API_KEY}`
  }
};

// Define API endpoints
app.use(
  '/api/token/v1.2',
  createProxyMiddleware({
    target: 'https://api.1inch.dev',
    changeOrigin: true,
    pathRewrite: {
      '^/api/token/v1.2': '/token/v1.2',  // Rewrite the path
    },
    onProxyReq: (proxyReq) => { // Intercept the request and set headers
      proxyReq.headers = {
        ...proxyReq.headers,
        ...axiosHeaders.headers // Set the required headers
      };
    },
  })
);

app.use(
  '/api/1inch/swap/v5.2',
  createProxyMiddleware({
    target: 'https://api.1inch.dev',
    pathRewrite: {
      '^/api/1inch/swap/v5.2': '/swap/v5.2',  // Rewrite the path
    },
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      console.log(axiosHeaders);
      proxyReq.headers = {
        ...proxyReq.headers,
        ...axiosHeaders.headers
      };
    },
  })
);

// ... Other routes ...

// Start the server on a specified port (e.g., 3000)
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});