// ====== Initial Data ======
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// ====== DOM Elements ======
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const formContainer = document.getElementById('formContainer');

// ====== Initialize App ======
init();

function init() {
  populateCategoryFilter();
  showRandomQuote();
  createAddQuoteForm();
}

// ====== Functions ======

// Populate the category dropdown
function populateCategoryFilter() {
  categoryFilter.innerHTML = ''; // Clear existing options

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.appendChild(allOption);

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Display a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for "${selectedCategory}"</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category } = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = ''; // Clear previous

  const quoteText = document.createElement('p');
  quoteText.textContent = `"${text}"`;

  const categoryTag = document.createElement('div');
  categoryTag.className = 'category';
  categoryTag.textContent = `— ${category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(categoryTag);
}

// Create a form dynamically for adding new quotes
function createAddQuoteForm() {
  const formTitle = document.createElement('h2');
  formTitle.textContent = 'Add a New Quote';

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  formContainer.append(formTitle, quoteInput, categoryInput, addBtn);
}

// Add a new quote dynamically
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!newText || !newCategory) {
    alert('Please enter both quote text and category.');
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  
  // Update category filter and show confirmation
  populateCategoryFilter();

  quoteDisplay.innerHTML = `<p>✅ New quote added successfully!</p>`;
  
  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// ====== Event Listeners ======
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);
