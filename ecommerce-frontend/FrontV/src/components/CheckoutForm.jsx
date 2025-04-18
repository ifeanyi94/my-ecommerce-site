import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ product, onSuccess }) => {
  const stripe = useStripe(); //to talk to Stripe's API
  const elements = useElements(); //to manage the payment form elements, i.e access to card input field
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    /* 4b. Once card details are inputed and the user clicks 'Pay Now' button, this function runs. It sends the card details and the clientSecret to Stripe.  */
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/confirmation",
      },
      redirect: "if_required", 
    });

    setLoading(false);

    if (error) {
      console.error("Stripe error:", error.message);
      setErrorMessage(error.message);
    } 
    else if (paymentIntent && paymentIntent.status === "succeeded") { {/*4c. If payment goes through, show success message. */}
      console.log("PaymentIntent confirmed:", paymentIntent);
      setSuccess(true);
      
      if (onSuccess) onSuccess(); // 👈 clear cart on successful payment
    }
  };

  return (
    <div>
      {success ? ( //* 5. If payment is successful, show success message. */
        <div className="text-green-600 text-center font-semibold text-lg mt-4">
          ✅ Payment Successful! Thank you for purchasing <span className="font-bold">{product?.name}</span>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
        <p className="font-semibold">
            Paying for: {product?.name}
            {product?.items?.length > 0 && (
            <>
                {" – "}
                {product.items.join(", ")}
            </>
            )}
        </p>
        <p className="text-gray-600">
            ${(product?.price / 100).toFixed(2)}
        </p>


          <PaymentElement onReady={() => setIsReady(true)} /> { /* 4a.The actual credit card form which is exported into 'Elements' object in the parent Checkout.jsx. This is what is actually displayed and the user fills in credit card details.  */}

          <button
            type="submit"
            disabled={!stripe || !isReady || loading}
            className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-red-500 text-white py-2 rounded hover:opacity-90"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
