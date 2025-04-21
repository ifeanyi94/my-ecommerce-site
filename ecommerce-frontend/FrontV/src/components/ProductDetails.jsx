import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useHandleBuyNow } from "../utils/CheckoutUtils"; // Custom hook for handling the "Buy Now" functionality

const ProductDetails = ({ cart, setCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleBuyNow = useHandleBuyNow();


  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const addToCart = (product) => {
    const alreadyInCart = cart.find((item) => item.id === product.id);
    if (!alreadyInCart) {
      setCart([...cart, product]);
    }
    navigate("/cart");
  };

  if (loading) return <h2 className="text-center py-10 text-xl">Loading...</h2>;

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between relative">
        <div className="flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/products")}
            className="inline-block bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            ← Back to Products
          </motion.button>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            Product Details
          </h1>
        </div>

        <div className="flex-1 flex justify-end relative">
          <motion.div
            className="cursor-pointer"
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
      </header>

      {/* Main Product Section */}
      <main className="flex-grow container mx-auto py-10 px-4">
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row gap-8 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-contain"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-xl text-fuchsia-600 font-semibold mb-4">
              ${product.price / 100}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product)}
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
          </div>
        </motion.div>
      </main>

      <footer className="h-[100px] bg-gray-800 flex items-center justify-center border-t mt-auto">
        <img className="h-12 ml-auto animate-pulse" src="https://ecommerce-backend-scdt.onrender.com/images/logo.svg" alt="logo"/>

      </footer>
    </div>
  );
};

export default ProductDetails;
