const Stripe = require("stripe");
const stripe = Stripe(
  "STRIPE_SECRET_KEY_REMOVED"
); // substitui com a tua Secret Key

exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Montante não fornecido." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "eur",
      payment_method_types: ["mbway"],
      payment_method_options: {
        mbway: {
          // é possível adicionar um número de telefone para simular o MB WAY real
        },
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Erro ao criar PaymentIntent:", err);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
};
