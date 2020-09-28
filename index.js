const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// set up port
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
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
const routes_payment = require('./routes/routes_payment.js');

app.use('/api', router);
app.use('/payment', routes_payment);

// run server
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`
));