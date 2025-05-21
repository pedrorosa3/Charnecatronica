const Stripe = require("stripe");
const stripe = Stripe(
  "STRIPE_SECRET_KEY_REMOVED"
);

exports.createPaymentIntent = async (req, res) => {
  const { amount, metodoPagamento } = req.body;

  if (!amount || !metodoPagamento) {
    return res.status(400).json({ error: "Montante ou método não fornecido." });
  }

  try {
    if (metodoPagamento !== "cartao") {
      // Para métodos que não sejam cartão (ex: mbway), não criamos PaymentIntent
      return res.status(200).json({ message: "Método não necessita PaymentIntent." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // em cêntimos
      currency: "eur",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Erro ao criar PaymentIntent:", err);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
};
