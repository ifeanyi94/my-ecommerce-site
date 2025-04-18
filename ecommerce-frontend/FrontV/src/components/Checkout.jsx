import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51R4nbRFv1mWHcyr7HkezYYVINsv64n2niUcRs4Pl4gWdIDLcO3R7ofs5pxIeylHC35f1WAXZ9wkC121sQdLinuQA00h8cUlth8"); // 0. Stripe public key used to connect frontend to stripe to initiate a future payment

const Checkout = ({setCart}) => {
    const location = useLocation();
    const { product, clientSecret: passedClientSecret } = location.state || {};  //3a. The product and clientsecret are passed from server.js to CheckoutUtils.js to current component-Checkout.jsx via the location state.
    const [clientSecret, setClientSecret] = useState(passedClientSecret || null); // The clientSecret is set to the value passed from the server or null if not available. 
  
    useEffect(() => { // Fetch the client secret from the server if not passed in from Server/CheckoutUtils/ then here. This is done to ensure that the client secret is always available when the component mounts.
      const createPaymentIntent = async () => {
        try {
          const res = await fetch("http://localhost:5000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product }),
          });
  
          const data = await res.json();
          setClientSecret(data.clientSecret);
          console.log("Client secret received:", data.clientSecret);
        } catch (err) {
          console.error("Failed to create payment intent:", err);
        }
      };
  
      // If clientSecret wasn't passed in, fetch it using createPaymentIntent()
      if (product && !clientSecret) {
        createPaymentIntent();
      }
    }, [product, clientSecret]);
  

  const options = { clientSecret, appearance: { theme: "flat" } }; // 3b. Start-Initialize Stripe’s Elements component: Options object with clientSecret and appearance theme are passed to the Elements component to customize the UI of the payment form.

  if (!clientSecret) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
      <div className="max-w-md mx-auto bg-white shadow p-6 rounded-xl">
        <Elements stripe={stripePromise} options={options}> {/* 3c. End-Initialize Stripe’s Elements component: Elements securely shows Stripe’s UI (credit card form imported from checkoutform.jsx) and connects it with that clientSecret. */}
          <CheckoutForm product={product} onSuccess={() => setCart([])} /> 
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
