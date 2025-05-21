import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Typography } from "@mui/material";

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

const StripePayment = forwardRef(({ onSuccess }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    async handleStripePayment(clientSecret) {
      if (!stripe || !elements) {
        setError("Stripe não inicializado");
        return false;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Elemento de cartão não encontrado");
        return false;
      }

      try {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (result.error) {
          setError(result.error.message);
          return false;
        } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
          setError(null);
          onSuccess();
          return true;
        } else {
          setError("Pagamento não concluído.");
          return false;
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao processar o pagamento.");
        return false;
      }
    },
  }));

  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
      <CardElement options={cardElementOptions} />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
});

export default StripePayment;





