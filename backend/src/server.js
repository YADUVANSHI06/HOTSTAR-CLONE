const express = require("express");
const cors = require("cors");
const mongodbConnect = require("./config/db");
const movieController = require("./controllers/movie.controller");
const { register, login } = require("./controllers/signinsignup.controller");
const wishlistController = require("./controllers/wishlist.controller");
const googleController = require("./controllers/google.controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());
app.use(cors());

app.use("/", movieController);
app.use("/signup", register);
app.use("/signin", login);
app.use("/watchlist", wishlistController);
app.use("/google", googleController);

app.post("/pay", async (req, res) => {
  const response = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Premium Membership",
          },
          unit_amount: req.body.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000?success=true`,
    cancel_url: `http://localhost:3000/`,
  });

  res.send(response.url);
});

const port = process.env.PORT || 7000;
module.exports = () => {
  app.listen(port, async () => {
    try {
      await mongodbConnect();
      console.log(`Server is running on the port ${port}`);
    } catch (error) {
      console.log({
        message: error.message,
        location: "server.js",
      });
    }
  });
};
