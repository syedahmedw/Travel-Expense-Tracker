function loadData() {
  return {
    cols: JSON.parse(localStorage.getItem("et_columns") || "[]"),
    items: JSON.parse(localStorage.getItem("et_items") || "[]"),
  };
}

function renderSummary() {
  const { cols, items } = loadData();

  // totals
  let totals = {};
  cols.forEach((c) => (totals[c.id] = { name: c.name, total: 0 }));

  items.forEach((i) => {
    totals[i.colId].total += i.amount;
  });

  // pie chart
  const ctx = document.getElementById("pieChart");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.values(totals).map((t) => t.name),
      datasets: [
        {
          data: Object.values(totals).map((t) => t.total),
        },
      ],
    },
  });

  // summary table
  let html = "<h2>Totals</h2>";
  let grand = 0;

  Object.values(totals).forEach((t) => {
    grand += t.total;
    html += `<p>${t.name}: ₹${t.total}</p>`;
  });

  html += `<p><b>Grand Total: ₹${grand}</b></p>`;

  document.getElementById("totalsBox").innerHTML = html;
}

// EXPORTS
function exportJSON() {
  const { items } = loadData();
  const blob = new Blob([JSON.stringify(items)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.json";
  a.click();
}

function exportCSV() {
  const { items, cols } = loadData();
  let colNames = {};
  cols.forEach((c) => (colNames[c.id] = c.name));

  let csv = "Name,Amount,Column\n";
  items.forEach((i) => (csv += `${i.name},${i.amount},${colNames[i.colId]}\n`));

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
}

function exportExcel() {
  const { items, cols } = loadData();

  let colNames = {};
  cols.forEach((c) => (colNames[c.id] = c.name));

  const rows = [["Name", "Amount", "Column"]];
  items.forEach((i) => rows.push([i.name, i.amount, colNames[i.colId]]));

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");

  XLSX.writeFile(wb, "expenses.xlsx");
}

renderSummary();
