// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import Products from './components/Products.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx'
import { useState, useEffect } from "react";


function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  
  const handleBuyNow = async (product) => {
    try {
      const res = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
  
      const { clientSecret } = await res.json();
  
      navigate("/checkout", {
        state: {
          clientSecret,
          product,
        },
      });
    } catch (error) {
      console.error("Buy Now error:", error);
    }
  };
  
  return (
    <BrowserRouter> 
        <Routes>
            <Route path="/"element={<HomePage cart={cart} setCart={setCart} />} />
            <Route path="/home" element={<HomePage cart={cart} setCart={setCart} />} />
            <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
            <Route path="/products/:id" element={<ProductDetails cart={cart} setCart={setCart} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} /> {/* Pass cart state to Cart component */}
            <Route path="/checkout" element={<Checkout setCart={setCart} />} /> {/* Checkout route */}
            <Route path="*" element={<h2 className="text-center py-10 text-xl">404 Not Found</h2>} /> {/* Fallback route */}
            
            
           
        </Routes>   
    </BrowserRouter>   

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Editin.jsx <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App; 