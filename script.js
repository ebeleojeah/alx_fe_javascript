// Array of quotes (each quote is an object with text and category)
const quotes = [
  { text: "Believe in yourself and all that you are.", category: "Motivation" },
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteText").textContent = "No quotes available.";
    document.getElementById("quoteCategory").textContent = "";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteText").textContent = randomQuote.text;
  document.getElementById("quoteCategory").textContent = `Category: ${randomQuote.category}`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add new quote to the array
  quotes.push({ text: newText, category: newCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Optional feedback
  alert("Quote added successfully!");
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
