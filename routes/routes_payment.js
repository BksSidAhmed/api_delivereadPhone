const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51HMx6dIOQdAQbH8cK2ZMO8qV5HB2XgA37BomKPC3RiAoFg9LjGOw34Qsmbhnw4U2ruK8DDetEroBve29PBg9rMyQ00d5uh0ldq');

// create PaymentMethods
router.post('/createPaymentMethods/', (req, res) => {
    return stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: req.body.number,
          exp_month: req.body.month,
          exp_year: req.body.years,
          cvc: req.body.cvc,
        },  
    }).then(result => res.status(200).json(result)); 
});

// Create Customers
router.post('/createCustomers/', (req, res) => {
    return stripe.customers.create({
        name : req.body.name,
        email : req.body.email,
        description: 'Customer created',
        payment_method : req.body.paymentMethod    
    }).then(result => res.status(200).json(result)); 
});

// Create Subscription
router.post('/doSubscription/', (req, res) => {
    return stripe.subscriptions.create({
        customer: req.body.customer,
        default_payment_method : req.body.paymentMethod,
        items: [{price: 'price_1HWNs1IOQdAQbH8cnOTwPfJW'}],
    }).then(result => res.status(200).json(result));    
});

// Get Subscription
router.get('/getSubscription/:id', (req, res) => {
    return stripe.subscriptions.retrieve(
        req.params.id,
    ).then(result => res.status(200).json(result));    
});

// Del Subscription
router.put('/delSubscription/:id', (req, res) => {
    return stripe.subscriptions.update(
        req.params.id,
        {cancel_at_period_end: true}
    ).then(result => res.status(200).json(result));    
});

// create Token
router.post('/createTokens/', (req, res) => {
    return stripe.tokens.create({
        card: {
            number: req.body.number,
            exp_month: req.body.month,
            exp_year: req.body.years,
            cvc: req.body.cvc,
        },  
    }).then(result => res.status(200).json(result)); 
});

// Create Paymente
router.post('/doPayment/', (req, res) => {
    return stripe.charges.create({
        amount: 25000, // Unit: cents
        currency: 'eur',
        source: req.body.tokenId,
        description: 'Caution',  
    }).then(result => res.status(200).json(result)); 
});

module.exports = router;