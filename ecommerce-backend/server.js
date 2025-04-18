const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with the secret key

// dotenv.config(); // Load environment variables from a .env file into process.env

const app = express();// Create an Express application
app.use(cors());
app.use(express.json()); // Allows us to parse JSON data
// app.use('/images', express.static('images'));// Serve static files from the 'images' directory
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));


const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8')).products;
console.log('Loaded products',products) // Log the products to the console
console.log('Type of products',typeof products) // Log the type of products to the console


// Define a route to fetch all products
app.get('/products', (req, res) => {
    res.json(products) // Send the products as a JSON response
    
    console.log(process.env.STRIPE_SECRET_KEY)
})

// Define a route to fetch a single product by ID
app.get('/products/:id', (req, res) => { 
    const productId = parseInt(req.params.id); // Get the product ID from the request parameters
    const product = products.find(p => p.id === productId); // Find the product by ID
    if (!product) { // If product not found, send a 404 response
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product) // Send the products as a JSON response
    
    
})



// Define a route to create a payment intent. This route handles both single product and cart checkout
app.post('/create-payment-intent', async (req, res) => {
    const { product, cart } = req.body;
  
    let amount = 0;

    // Check if the request contains a cart or a single product. Calculate total amount.
    if (cart && Array.isArray(cart)) {
      amount = cart.reduce((total, item) => total + item.price, 0);
    } else if (product) {
      amount = product.price;
    } else {
      return res.status(400).json({ error: "Missing product or cart data" });
    }
  
    // 2a. Backend uses Stripe Software dev kit (SDK) to create a PaymentIntent (i.e., tells Stripe "someone wants to pay $X").
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.send({ clientSecret: paymentIntent.client_secret }); // 2b.Stripe responds with a clientSecret, which allows the frontend to securely complete the payment.
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 5000;

// Serve static files from the frontend (Vite's dist folder)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all route for SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
