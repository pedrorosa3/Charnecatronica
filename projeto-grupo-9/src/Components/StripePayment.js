import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box } from "@mui/material";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const StripePayment = forwardRef(({ amount, onSuccess }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    async handleStripePayment() {
      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Simular sucesso sem backend
      onSuccess();
    },
  }));

  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
      <CardElement options={cardElementOptions} />
      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </Box>
  );
});

export default StripePayment;



