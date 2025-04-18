import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHandleBuyNow } from "../utils/CheckoutUtils"; // Custom hook for handling the "Buy Now" functionality
import { Trash2 } from "lucide-react"; // Importing Trash2 icon from lucide-react
import { useEffect } from "react";



const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const handleBuyNow = useHandleBuyNow();

useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/products")}
          className="bg-white text-black px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          ← Back to Products
        </motion.button>

        <h1 className="text-xl font-bold tracking-wide">Your Cart</h1>

        <div className="w-8"></div> {/* Spacer to balance layout */}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-10">
        {cart.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🛒 Your cart is empty. Go grab some gadgets!
          </motion.p>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {cart.map((item, index) => (
                <motion.div
                    key={index}
                    className="flex items-center gap-6 bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
                    variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                    }}
                >
                    <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain"
                    />
                    <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {item.name}
                    </h2>
                    <p className="text-pink-600 font-medium text-lg">
                        ${((item.price ?? 0) / 100).toFixed(2)}
                    </p>
                    </div>

                    {/* 👇 MOVE the delete button here, inside the loop */}
                    <button
                    onClick={() => {
                        const updatedCart = cart.filter((_, i) => i !== index);
                        setCart(updatedCart);
                    }}
                    className="ml-auto text-red-500 hover:text-red-700 transition"
                    aria-label="Remove item"
                    >
                    <Trash2 size={20} />
                    </button>
                </motion.div>
            ))}

            <button
                onClick={() => {
                setCart([]);
                localStorage.removeItem("cart");
                }}
                className="w-full bg-red-100 text-red-600 font-medium py-2 rounded-lg border border-red-300 hover:bg-red-200 transition mb-4"
            >
            🗑️ Clear Cart
            </button>

            <button
                onClick={(e) => {
                e.stopPropagation();
                const totalPrice = cart.reduce((acc, item) => acc + (item.price ?? 0), 0); // sum the cart
                handleBuyNow({
                name: "Cart Items",
                price: totalPrice,
                items: cart.map((item) => item.name),        
                });
                }}
                className="flex-1 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-pink-600 text-white font-semibold py-2 rounded-lg hover:opacity-90"
                >
                Proceed to checkout
            </button>
                  

          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 flex items-center justify-center mt-auto">
        <img
          src="/src/images/EcommLogo2.svg"
          className="h-10 animate-pulse ml-auto"
          alt="logo"
        />
      </footer>
    </div>
  );
};

export default Cart;
