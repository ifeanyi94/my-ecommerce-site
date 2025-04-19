import { useNavigate } from "react-router-dom";

export const useHandleBuyNow = () => {
  const navigate = useNavigate();

  //	1a. User clicks 'Buy Now'. Frontend sends product/cart info to backend server.js.
  const handleBuyNow = async (itemOrCart) => {
    try {
      const isCart = Array.isArray(itemOrCart);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isCart ? { cart: itemOrCart } : { product: itemOrCart }),
      });

      const { clientSecret } = await res.json();

      if (isCart) {
        localStorage.removeItem("cart");
      }

      navigate("/checkout", { // 2c. Frontend receives clientSecret from backend and redirects to checkout page.
        state: {
          clientSecret,
          product: isCart
            ? {
                name: "Cart Items",
                price: itemOrCart.reduce((sum, item) => sum + item.price, 0),
              }
            : itemOrCart,
        },
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return handleBuyNow;
};
