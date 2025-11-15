// Quotes array with default quotes
let quotes = [
  { text: "Success is no accident.", category: "Motivation" },
  { text: "The only limit is your mind.", category: "Mindset" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update display
  quoteDisplay.textContent = `${randomQuote.text} — (${randomQuote.category})`;
}

// Function to add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  // Validation
  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add new quote object to array
  const newQuoteObj = {
    text: newText,
    category: newCategory
  };

  quotes.push(newQuoteObj);

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added successfully!");
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const showQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');

  showQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
});
