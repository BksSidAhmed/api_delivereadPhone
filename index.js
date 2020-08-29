const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// set up port
const PORT = process.env.PORT || 3030;
app.use(bodyParser.json());
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
  })
//app.use(cors());
// add routes
const router = require('./routes/router.js');
app.use('/api', router);
// run server
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`
));