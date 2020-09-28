const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51HMx6dIOQdAQbH8cK2ZMO8qV5HB2XgA37BomKPC3RiAoFg9LjGOw34Qsmbhnw4U2ruK8DDetEroBve29PBg9rMyQ00d5uh0ldq');

// create paymentMethods
router.post('/createPaymentMethods/', (req, res) => {
    return stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 9,
          exp_year: 2021,
          cvc: '314',
        },  
    }).then(result => res.status(200).json(result)); 
});

// Create customers
router.post('/createCustomers/', (req, res) => {
    return stripe.customers.create({
        name : req.body.name,
        email : req.body.email,
        description: 'Customer created',
        payment_method : 'pm_1HWTOTIOQdAQbH8chKcFXrU7'  
    }).then(result => res.status(200).json(result)); 
});

// Subscription
router.post('/doSubscription/', (req, res) => {
    return stripe.subscriptions.create({
        customer: 'cus_I6gpu0fDEHpaY4',
        items: [{price: 'price_1HWNs1IOQdAQbH8cnOTwPfJW'}],
    }).then(result => res.status(200).json(result));    
});

// Paymente
router.post('/doPayment/', (req, res) => {
    return stripe.charges.create({
        amount: req.body.amount, // Unit: cents
        currency: 'eur',
        source: req.body.tokenId,
        description: 'Test payment',  
        default_payment_method : 'pm_1HWTOTIOQdAQbH8chKcFXrU7'
    }).then(result => res.status(200).json(result)); 
});


module.exports = router;