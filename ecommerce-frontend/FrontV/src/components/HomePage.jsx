import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useHandleBuyNow } from "../utils/CheckoutUtils"; // Custom hook for handling the "Buy Now" functionality



const HomePage = ({ cart, setCart}) => {
  const [products, setProducts] = useState([]); // State to hold products
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bannerMessages = [
    "🌞 Summer sales coming soon!",
    "🛡️ Get a 2-year warranty on your purchase!",
    "💬 Nicola says 'It's not just a store, it's a family to me!'",
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const handleBuyNow = useHandleBuyNow();

  
/// Fetch products from the server when the component mounts
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Function to handle product click and navigate to product details page
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Function to add product to cart
  const addToCart = (product) => {
    // Check if the product is already in the cart
    const isAlreadyInCart = cart.find((item) => item.id === product.id);

    if (isAlreadyInCart) {
      console.log(`${product.name} is already in the cart.`);
    } else {
      setCart([...cart, product]);
      console.log("Cart now:", [...cart, product]);
    }
  };


/// Function to handle automatic banner message change
  useEffect(() => { 
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerMessages.length);
    }, 3000); 
    return () => clearInterval(interval); // clear interval on component unmount
  }, []);

  return (
    // Top navigation bar with title and links
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-100"> 

      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">

        <nav className="space-x-4 pr-10">
          <motion.div className="hover:underline inline-block" whileHover={{ scale: 1.1 }}>
            <Link to="/" className="hover:underline" whileHover={{ scale: 1.5, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}>Home</Link> 
          </motion.div>
          <motion.div className= "hover:underline inline-block" whileHover={{ scale: 1.1 }}>
            <Link to="/products" className="hover:underline">Products</Link> 
          </motion.div>
        </nav> 
        
        {/* Cart Icon Section */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="text-white text-2xl" />
          {cart.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cart.length}
            </div>
          )}
        </motion.div>

      </div>

{/* This is the main content area of the page       */}
      <main className= "flex-grow container border-4 border-red-500 min-w-screen mx-0 py-10 px-6">
      
      <motion.div
        key={currentBannerIndex}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-2 px-4 rounded-xl shadow-md mb-4 w-fit mx-auto"
      >
        {bannerMessages[currentBannerIndex]}
      </motion.div>


        <motion.h1
          className="text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-red-500 text-transparent bg-clip-text text-center mb-10"
          
          animate={{
            opacity: 1,
            y: 0,
            textShadow: "0 0 20px rgba(236, 72, 153, 0.8), 0 0 30px rgba(236, 72, 153, 0.6)",
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileInView={{
            textShadow: [
              "0 0 10px rgba(236, 72, 153, 0.4)",
              "0 0 20px rgba(236, 72, 153, 0.6)",
              "0 0 30px rgba(236, 72, 153, 0.8)",
              "0 0 20px rgba(236, 72, 153, 0.6)",
              "0 0 10px rgba(236, 72, 153, 0.4)",
            ],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
            ease: "easeInOut",
          }}
        >
          ⚡ The GADGET STORE ⚡
          </motion.h1>
        
          <motion.h2
            className="text-lg text-gray-600 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}> Your one-stop tech shop 🚀
          </motion.h2>

     {/* Product Grid  */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  p-4 border-1 border-gray-200"
        initial="hidden" 
        animate="visible" 
        variants={{ 
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        >
        
        {products.map((product) => (
          <motion.div  key={product.id} 
          onClick={() => handleProductClick(product.id)} 
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}

          >
            <img src={product.image} alt= "picture" className="w-60 h-40 object-contain mb-2 rounded" />
            <div>
              <h3 className="text-1g font-semibold hover:underline hover:opacity-90 hover:cursor-pointer">{product.name}</h3>
              <p className="text-gray-700">${(product.price/100).toFixed(2)} </p>
            </div>
            <div className="p-4 pt-0 flex gap-2">
              
                <motion.button
                whileTap={{ scale: 0.9 }} 
                className="flex-1 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-pink-600 text-white font-semibold py-2 rounded-lg hover:opacity-90" 
                onClick={
                  (e) => {e.stopPropagation(); console.log("Add to cart clicked for:", product.name);/* Add to cart logic here*/; 
                    addToCart(product); 
                    navigate("/cart"); /* Navigate to cart page */}
                  }>Add to cart
                </motion.button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); console.log("Buy now clicked for:", product.name); /* Buy now logic here */
                    // Call the handleBuyNow function to initiate the payment process
                    handleBuyNow(product);
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-pink-600 text-white font-semibold py-2 rounded-lg hover:opacity-90"
                >
                  Buy now
                </button>

            </div>
            
          </motion.div>
          
        ))}
          
      </motion.div>

      </main>
      <footer className="h-[100px] bg-gray-800 flex items-center justify-center border-t mt-auto">
        <img className="h-12 ml-auto animate-pulse" src="https://ecommerce-backend-scdt.onrender.com/images/EcommLogo2.svg" alt="logo"/>

      </footer>
      
      
    </div>
    
  );
}

export default HomePage;