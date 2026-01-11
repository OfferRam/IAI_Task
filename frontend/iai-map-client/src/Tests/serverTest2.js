//***  serverTest2.ts
//***  I used it to debug the resriction of the WebService from connecting to react app
//***  All rest calles were terminated withou a response
//***  DEBUGed with node "file name"

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/geo', (req, res) => {
  console.log('Received polygon:', req.body);
  res.json({ success: true });
});
app.listen(7170, () => console.log('Server running on port 7170'));
