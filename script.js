// -----------------------------
// INITIAL SETUP
// -----------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let lastFilter = localStorage.getItem("lastFilter") || "all";
const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // mock API
const syncStatus = document.getElementById("syncStatus");

// -----------------------------
// STORAGE FUNCTIONS
// -----------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------
// DISPLAY FUNCTIONS
// -----------------------------
function displayQuotes(filteredQuotes = quotes) {
  const container = document.getElementById("quoteList");
  container.innerHTML = "";

  if (filteredQuotes.length === 0) {
    container.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  filteredQuotes.forEach((quote) => {
    const div = document.createElement("div");
    div.classList.add("quote-item");
    div.innerHTML = `
      <p>"${quote.text}"</p>
      <p class="category">Category: ${quote.category}</p>
    `;
    container.appendChild(div);
  });
}

// -----------------------------
// QUOTE ADDITION
// -----------------------------
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim() || "Uncategorized";

  if (!text) {
    alert("Please enter a quote!");
    return;
  }

  const newQuote = { text, category, id: Date.now(), updatedAt: new Date().toISOString() };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  syncWithServer();
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

// -----------------------------
// CATEGORY MANAGEMENT
// -----------------------------
function populateCategories() {
  const filterSelect = document.getElementById("categoryFilter");
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];

  filterSelect.innerHTML = "";
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === lastFilter) option.selected = true;
    filterSelect.appendChild(option);
  });
}

// -----------------------------
// FILTER FUNCTION
// -----------------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  lastFilter = selected;
  localStorage.setItem("lastFilter", selected);

  if (selected === "all") displayQuotes();
  else displayQuotes(quotes.filter(q => q.category === selected));
}

// -----------------------------
// IMPORT / EXPORT
// -----------------------------
function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else alert("Invalid JSON file format.");
    } catch {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -----------------------------
// SERVER SYNC (Simulation)
// -----------------------------
async function syncWithServer() {
  setSyncStatus("Syncing with server...");

  try {
    // 1. Simulate server fetch
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Only take a few mock items
    const simulatedServerQuotes = serverQuotes.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      category: "Server",
      updatedAt: new Date().toISOString()
    }));

    // 2. Conflict Resolution — server data wins if ID matches
    const merged = resolveConflicts(quotes, simulatedServerQuotes);
    quotes = merged;

    // 3. Save and display
    saveQuotes();
    populateCategories();
    filterQuotes();

    setSyncStatus("✅ Sync complete! Server data merged successfully.");

  } catch (error) {
    console.error("Sync error:", error);
    setSyncStatus("❌ Sync failed. Please check your internet connection.");
  }
}

// -----------------------------
// CONFLICT RESOLUTION LOGIC
// -----------------------------
function resolveConflicts(localQuotes, serverQuotes) {
  const merged = [...localQuotes];

  serverQuotes.forEach(serverQuote => {
    const existing = merged.find(q => q.id === serverQuote.id);

    if (!existing) {
      // New quote from server — add it
      merged.push(serverQuote);
    } else {
      // Conflict: decide by latest updatedAt
      const localTime = new Date(existing.updatedAt);
      const serverTime = new Date(serverQuote.updatedAt);

      if (serverTime > localTime) {
        const index = merged.findIndex(q => q.id === existing.id);
        merged[index] = serverQuote;
      }
    }
  });

  return merged;
}

// -----------------------------
// HELPER: STATUS MESSAGES
// -----------------------------
function setSyncStatus(message) {
  syncStatus.textContent = message;
  setTimeout(() => (syncStatus.textContent = ""), 5000);
}

// -----------------------------
// AUTO-SYNC EVERY 60 SECONDS
// -----------------------------
setInterval(syncWithServer, 60000);

// -----------------------------
// INITIALIZATION
// -----------------------------
window.onload = function() {
  populateCategories();
  filterQuotes();
  setSyncStatus("Ready. Local data loaded.");
};
