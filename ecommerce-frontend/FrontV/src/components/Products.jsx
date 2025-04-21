import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useHandleBuyNow } from "../utils/CheckoutUtils"; // Custom hook for handling the "Buy Now" functionality

const Products = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const MotionLink = motion(Link); // Create a motion version of Link
  const handleBuyNow = useHandleBuyNow();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  const addToCart = (product) => {
    const alreadyInCart = cart.find((item) => item.id === product.id);
    if (!alreadyInCart) {
      setCart([...cart, product]);
    }
  };

  return (
  <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col">
    <header className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between relative">
      {/* Left: Home Link */}
      <motion.div className="flex-1">
        <MotionLink
          to="/"
          className="text-lg inline-block"
          style={{ display: "inline-block" }} // ensures scaling/hover behaves correctly
          whileHover={{
            scale: 1.1,
          }}>
          <span className="hover:underline">Home</span>
        </MotionLink>
      </motion.div>


      {/* Center: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
          Our Products
        </h1>
      </div>

      {/* Right: Cart Icon */}
      <div className="flex-1 flex justify-end relative">
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/cart")}>
          <FaShoppingCart className="text-white text-2xl" />
          {cart.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cart.length}
            </div>
          )}
        </motion.div>
      </div>

    </header>




      <main className="flex-grow container mx-auto py-10 px-4">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
            <motion.div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleProductClick(product.id)}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain bg-white p-4"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1 hover:underline">
                  {product.name}
                </h2>
                <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                    navigate("/cart");
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-red-500 text-white py-2 rounded-lg font-semibold hover:opacity-90"
                >
                  Add to Cart
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
        <img className="h-12 ml-auto animate-pulse" src="https://ecommerce-backend-scdt.onrender.com/images/logo.svg" alt="logo"/>

      </footer>
    </div>
  );
};

export default Products;
