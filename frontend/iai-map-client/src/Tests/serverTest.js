//***  serverTest.ts
//***  I used it to debug the resriction of the WebService from connecting to react app
//***  All rest calles were terminated withou a response
//***  DEBUGed with node "file name"

import express from 'express';
import cors from 'cors';

const app = express();
// Parse JSON body
app.use(express.json());
// Allow requests from React dev server
app.use(cors());
// Test endpoint
app.post('/api/geo', (req, res) => {
  console.log('Received polygon:', req.body);
  res.status(200).json({ success: true }); // MUST respond
});
app.listen(7170, () => console.log('Server running on port 7170'));
