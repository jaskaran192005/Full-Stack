const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let cards = [];
let nextId = 1;

// Homepage route
app.get("/", (req, res) => {
  res.send("🎴 Welcome to the Playing Card API! Use /cards to see all cards.");
});


app.get("/cards", (req, res) => {
  res.json(cards);
});

app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({ error: "Suit and value are required" });
  }

  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);
  res.status(201).json(newCard);
});

app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json(card);
});

app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Card not found" });
  }

  const deletedCard = cards.splice(index, 1);
  res.json({ message: "Card deleted", card: deletedCard[0] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
