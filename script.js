// =======================
// LocalStorage Keys
// =======================
const COL_KEY = "et_columns";
const ITEM_KEY = "et_items";
const BUDGET_KEY = "et_budget";

// =======================
// Load Saved Data
// =======================
let columns = JSON.parse(localStorage.getItem(COL_KEY) || "[]");
let items = JSON.parse(localStorage.getItem(ITEM_KEY) || "[]");
let budget = Number(localStorage.getItem(BUDGET_KEY) || 25000);

// =======================
// UI Elements
// =======================
const columnsContainer = document.getElementById("columns");
const budgetInput = document.getElementById("budgetLimit");
const grandTotalEl = document.getElementById("grandTotal");
const budgetWarningEl = document.getElementById("budgetWarning");
const addColumnBtn = document.getElementById("addColumnBtn");

// =======================
// Create Default Columns
// =======================
if (columns.length === 0) {
  const now = Date.now();
  columns = [
    { id: now, name: "Travel / Room / Food" },
    { id: now + 1, name: "Shopping / Misc" },
  ];
  localStorage.setItem(COL_KEY, JSON.stringify(columns));
}

// =======================
// Save Function
// =======================
function save() {
  localStorage.setItem(COL_KEY, JSON.stringify(columns));
  localStorage.setItem(ITEM_KEY, JSON.stringify(items));
  localStorage.setItem(BUDGET_KEY, budget);
}

// =======================
// RENDER EVERYTHING
// =======================
function renderAll() {
  columnsContainer.innerHTML = "";

  columns.forEach((col) => {
    const card = document.createElement("div");
    card.className = "column-card";

    card.innerHTML = `
            <div class="column-title"
                 contenteditable="true"
                 data-col-id="${col.id}">
                ${col.name}
            </div>

            <input id="name-${col.id}" placeholder="Name">
            <input id="amount-${col.id}" type="number" placeholder="Amount">

            <button class="add-btn" onclick="addItem(${col.id})">Add</button>

            <div id="items-${col.id}" class="items-list"></div>

            <div class="total-row">
                Total: ₹<span id="total-${col.id}">0</span>
            </div>
        `;

    columnsContainer.appendChild(card);
  });

  // COLUMN RENAME
  document.querySelectorAll("[data-col-id]").forEach((el) => {
    el.addEventListener("blur", () => {
      const id = Number(el.dataset.colId);
      const col = columns.find((c) => c.id === id);
      col.name = el.innerText.trim() || "Untitled";
      save();
      renderItems();
      calculateGrandTotal();
    });
  });

  renderItems();
}

// =======================
// RENDER ITEMS + COLUMN TOTALS
// =======================
function renderItems() {
  columns.forEach((col) => {
    let total = 0;
    const container = document.getElementById(`items-${col.id}`);
    container.innerHTML = "";

    items
      .filter((i) => i.colId === col.id)
      .forEach((item) => {
        total += item.amount;

        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
                    ${item.name} - ₹${item.amount}
                    <button class="item-delete-btn" onclick="deleteItem(${item.id})">x</button>
                `;
        container.appendChild(row);
      });

    document.getElementById(`total-${col.id}`).innerText = total;
  });

  calculateGrandTotal();
}

// =======================
// ADD ITEM
// =======================
function addItem(colId) {
  const nameEl = document.getElementById(`name-${colId}`);
  const amountEl = document.getElementById(`amount-${colId}`);

  if (!nameEl.value || !amountEl.value) {
    alert("Enter name and amount");
    return;
  }

  items.push({
    id: Date.now(),
    colId,
    name: nameEl.value,
    amount: Number(amountEl.value),
  });

  save();
  nameEl.value = "";
  amountEl.value = "";

  renderItems();
}

// =======================
// DELETE ITEM
// =======================
function deleteItem(id) {
  items = items.filter((i) => i.id !== id);
  save();
  renderItems();
}

// =======================
// GRAND TOTAL CALCULATION
// =======================
function calculateGrandTotal() {
  let sum = 0;

  columns.forEach((col) => {
    sum += items
      .filter((it) => it.colId === col.id)
      .reduce((a, b) => a + b.amount, 0);
  });

  grandTotalEl.innerText = `Total Spent: ₹${sum}`;

  budgetWarningEl.innerText =
    sum > budget ? `Over Budget by ₹${sum - budget}` : "";
}

// =======================
// ADD NEW COLUMN
// =======================
addColumnBtn.addEventListener("click", () => {
  columns.push({
    id: Date.now(),
    name: "New Column",
  });

  save();
  renderAll();
});

// =======================
// BUDGET CHANGE
// =======================
budgetInput.value = budget;
budgetInput.addEventListener("change", () => {
  budget = Number(budgetInput.value);
  save();
  calculateGrandTotal();
});

// =======================
// INITIAL RENDER
// =======================
renderAll();
calculateGrandTotal();
