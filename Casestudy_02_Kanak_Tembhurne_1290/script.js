/* ============ PLANT CATALOG DATA ============ */
const PLANTS = [
  {
    id: "p014", no: "014", name: "Monstera Deliciosa", latin: "Monstera deliciosa",
    price: 899, light: 3, water: 1, tags: ["low-light", "air-purifying"],
    img: "images/monstera.jpg"
  },
  {
    id: "p021", no: "021", name: "Snake Plant", latin: "Dracaena trifasciata",
    price: 449, light: 1, water: 1, tags: ["low-light", "pet-safe", "air-purifying"],
    img: "images/snake-plant.jpg"
  },
  {
    id: "p033", no: "033", name: "Golden Pothos", latin: "Epipremnum aureum",
    price: 349, light: 2, water: 2, tags: ["low-light", "air-purifying"],
    img: "images/pothos.jpg"
  },
  {
    id: "p008", no: "008", name: "Echeveria Elegans", latin: "Echeveria elegans",
    price: 249, light: 3, water: 1, tags: ["succulent", "pet-safe"],
    img: "images/echeveria.jpg"
  },
  {
    id: "p017", no: "017", name: "Fiddle Leaf Fig", latin: "Ficus lyrata",
    price: 1299, light: 3, water: 2, tags: ["air-purifying"],
    img: "images/fiddle-leaf.jpg"
  },
  {
    id: "p026", no: "026", name: "Areca Palm", latin: "Dypsis lutescens",
    price: 799, light: 3, water: 2, tags: ["pet-safe", "air-purifying"],
    img: "images/areca-palm.jpg"
  },
  {
    id: "p039", no: "039", name: "ZZ Plant", latin: "Zamioculcas zamiifolia",
    price: 549, light: 1, water: 1, tags: ["low-light"],
    img: "images/zz-plant.jpg"
  },
  {
    id: "p011", no: "011", name: "Peperomia Obtusifolia", latin: "Peperomia obtusifolia",
    price: 329, light: 2, water: 2, tags: ["pet-safe", "low-light"],
    img: "images/peperomia.jpg"
  }
];

/* ============ STATE ============ */
let cart = {}; // { id: qty }

/* ============ CARD RENDERING ============ */
function iconSun(filled){
  return `<svg class="${filled ? 'filled' : 'empty'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>`;
}
function iconDrop(filled){
  return `<svg class="${filled ? 'filled' : 'empty'}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2s6 7 6 11.5a6 6 0 0 1-12 0C6 9 12 2 12 2Z"/></svg>`;
}

function renderCard(p){
  const sunIcons = [1,2,3].map(n => iconSun(n <= p.light)).join("");
  const dropIcons = [1,2,3].map(n => iconDrop(n <= p.water)).join("");
  return `
  <article class="plant-card" data-tags="${p.tags.join(' ')}">
    <div class="card-media">
      <img src="${p.img}" alt="${p.name}, a healthy potted plant" loading="lazy">
      <span class="card-no">No. ${p.no}</span>
    </div>
    <div class="card-body">
      <h3>${p.name}</h3>
      <span class="card-latin">${p.latin}</span>
      <div class="card-icons">
        <span class="icon-group" title="Light needs">${sunIcons}</span>
        <span class="icon-group" title="Watering">${dropIcons}</span>
      </div>
      <div class="card-footer">
        <span class="card-price">₹${p.price}</span>
        <button class="add-btn" data-id="${p.id}">Add to cart</button>
      </div>
    </div>
  </article>`;
}

function renderGrid(filter = "all"){
  const grid = document.getElementById("plantGrid");
  const list = filter === "all" ? PLANTS : PLANTS.filter(p => p.tags.includes(filter));
  grid.innerHTML = list.map(renderCard).join("");
}

/* ============ FILTERS ============ */
function initFilters(){
  const row = document.getElementById("filterRow");
  row.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    row.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    renderGrid(btn.dataset.filter);
  });
}

/* ============ CART LOGIC ============ */
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}
function changeQty(id, delta){
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}
function removeFromCart(id){
  delete cart[id];
  updateCartUI();
}

function updateCartUI(){
  const items = Object.entries(cart);
  const count = items.reduce((sum, [, qty]) => sum + qty, 0);
  document.getElementById("cartCount").textContent = count;

  const cartItemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");

  if (items.length === 0){
    cartItemsEl.innerHTML = `<p class="cart-empty" id="cartEmpty">Your cart is empty. Go find a plant.</p>`;
  } else {
    cartItemsEl.innerHTML = items.map(([id, qty]) => {
      const p = PLANTS.find(x => x.id === id);
      return `
      <div class="cart-line" data-id="${id}">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-line-body">
          <h4>${p.name}</h4>
          <div class="cart-line-meta">
            <div class="qty-control">
              <button class="qty-minus" data-id="${id}" aria-label="Decrease quantity">&minus;</button>
              <span>${qty}</span>
              <button class="qty-plus" data-id="${id}" aria-label="Increase quantity">+</button>
            </div>
            <span>₹${p.price * qty}</span>
          </div>
          <button class="remove-line" data-id="${id}">Remove</button>
        </div>
      </div>`;
    }).join("");
  }

  const subtotal = items.reduce((sum, [id, qty]) => {
    const p = PLANTS.find(x => x.id === id);
    return sum + p.price * qty;
  }, 0);
  document.getElementById("cartSubtotal").textContent = `₹${subtotal}`;
}

function initCartEvents(){
  // add to cart (event delegation on grid)
  document.getElementById("plantGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    addToCart(btn.dataset.id);
    btn.textContent = "Added ✓";
    btn.classList.add("is-added");
    setTimeout(() => {
      btn.textContent = "Add to cart";
      btn.classList.remove("is-added");
    }, 1200);
  });

  // qty / remove (event delegation on cart items)
  document.getElementById("cartItems").addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains("qty-plus")) changeQty(id, 1);
    if (e.target.classList.contains("qty-minus")) changeQty(id, -1);
    if (e.target.classList.contains("remove-line")) removeFromCart(id);
  });

  // drawer open/close
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");

  function openCart(){
    drawer.classList.add("is-open");
    backdrop.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }
  function closeCart(){
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (Object.keys(cart).length === 0){
      alert("Your cart is empty — add a plant first.");
      return;
    }
    closeCart();
    openInvoicePanel();
  });
}

/* ============ INVOICE / BILLING (Case Study 02) ============ */

// Step 1: Auto-generate invoice number
function generateInvoiceNo(){
  var d = new Date();
  var year = d.getFullYear();
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  var random = Math.floor(Math.random() * 900 + 100);
  return "INV-" + year + month + day + "-" + random;
}

// Step 2: Set today's date in YYYY-MM-DD format (for date input)
function getTodayDate(){
  var d = new Date();
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// Step 3: Fill product table from cart
function prefillInvoiceFromCart(){
  var tbody = document.getElementById("invoiceProductBody");
  var items = Object.entries(cart);
  var html = "";

  for (var i = 0; i < items.length; i++){
    var id = items[i][0];
    var qty = items[i][1];
    var plant = PLANTS.find(function(p){ return p.id === id; });
    if (!plant) continue;

    var lineTotal = plant.price * qty;
    html += "<tr data-id=\"" + id + "\">";
    html += "<td>" + plant.name + "</td>";
    html += "<td><input type=\"number\" class=\"inv-qty\" data-id=\"" + id + "\" min=\"1\" value=\"" + qty + "\"></td>";
    html += "<td class=\"inv-rate\" data-id=\"" + id + "\">" + plant.price + "</td>";
    html += "<td class=\"line-total\" data-id=\"" + id + "\">" + lineTotal + "</td>";
    html += "</tr>";
  }

  tbody.innerHTML = html;
  document.getElementById("invoiceNo").value = generateInvoiceNo();
  document.getElementById("invoiceDate").value = getTodayDate();
}

// Update line total when quantity changes
function updateLineTotal(id){
  var qtyInput = document.querySelector(".inv-qty[data-id=\"" + id + "\"]");
  var rateCell = document.querySelector(".inv-rate[data-id=\"" + id + "\"]");
  var totalCell = document.querySelector(".line-total[data-id=\"" + id + "\"]");
  var qty = Number(qtyInput.value);
  var rate = Number(rateCell.textContent);
  if (qty < 1) qty = 1;
  totalCell.textContent = (qty * rate).toFixed(2);
}

// Step 4: Calculate subtotal from product table
function getSubtotalFromTable(){
  var lineTotals = document.querySelectorAll(".line-total");
  var subtotal = 0;
  for (var i = 0; i < lineTotals.length; i++){
    subtotal = subtotal + Number(lineTotals[i].textContent);
  }
  return subtotal;
}

// Step 5: Main bill calculation (like Calculator.html — read, calculate, show)
function calculateBill(){
  // Read customer details
  var customerName = document.getElementById("custName").value.trim();
  var mobile = document.getElementById("mobile").value.trim();
  var invoiceNo = document.getElementById("invoiceNo").value;
  var invoiceDate = document.getElementById("invoiceDate").value;

  // Validate mobile (10 digits)
  if (mobile.length !== 10 || isNaN(mobile)){
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }
  if (customerName === ""){
    alert("Please enter customer name.");
    return;
  }

  // Read billing options (Number() like Calculator.html)
  var discountPct = Number(document.getElementById("discount").value);
  var gstPct = Number(document.getElementById("gst").value);
  var packingInput = Number(document.getElementById("packing").value);

  // Read payment mode and membership from radio buttons
  var paymentMode = document.querySelector("input[name=\"paymentMode\"]:checked").value;
  var membership = document.querySelector("input[name=\"membership\"]:checked").value;
  var isMember = (membership === "yes");

  // Calculate step by step
  var subtotal = getSubtotalFromTable();
  var discountAmt = subtotal * (discountPct / 100);
  var afterDiscount = subtotal - discountAmt;

  var memberDisc = 0;
  if (isMember){
    memberDisc = afterDiscount * 0.05;
    afterDiscount = afterDiscount - memberDisc;
  }

  var gstAmt = afterDiscount * (gstPct / 100);
  var packing = isMember ? 0 : packingInput;
  var grandTotal = afterDiscount + gstAmt + packing;

  // Build receipt HTML
  var receipt = document.getElementById("billReceipt");
  var html = "";
  html += "<div class='receipt-logo'>Terra <span>&amp;</span> Leaf</div>";
  html += "<p class='receipt-store'>Nagpur &middot; terraandleaf.example</p>";
  html += "<h3>Bill Receipt</h3>";
  html += "<div class=\"bill-row\"><span>Customer</span><strong>" + customerName + "</strong></div>";
  html += "<div class=\"bill-row\"><span>Mobile</span><strong>" + mobile + "</strong></div>";
  html += "<div class=\"bill-row\"><span>Invoice No</span><strong>" + invoiceNo + "</strong></div>";
  html += "<div class=\"bill-row\"><span>Date</span><strong>" + invoiceDate + "</strong></div>";
  html += "<div class=\"bill-row\"><span>Subtotal</span><strong>₹" + subtotal.toFixed(2) + "</strong></div>";

  if (discountPct > 0){
    html += "<div class=\"bill-row bill-discount\"><span>Discount (" + discountPct + "%)</span><strong>−₹" + discountAmt.toFixed(2) + "</strong></div>";
  }
  if (isMember){
    html += "<div class=\"bill-row bill-discount\"><span>Membership (5% extra)</span><strong>−₹" + memberDisc.toFixed(2) + "</strong></div>";
    html += "<div class=\"bill-row\"><span>Packing charges</span><strong>₹0 (waived)</strong></div>";
  } else {
    html += "<div class=\"bill-row\"><span>Packing charges</span><strong>₹" + packing.toFixed(2) + "</strong></div>";
  }

  html += "<div class=\"bill-row\"><span>GST (" + gstPct + "%)</span><strong>₹" + gstAmt.toFixed(2) + "</strong></div>";
  html += "<div class=\"bill-row\"><span>Payment mode</span><strong>" + paymentMode + "</strong></div>";
  html += "<div class=\"bill-row bill-total\"><span>Grand Total</span><span>₹" + grandTotal.toFixed(2) + "</span></div>";
  html += "<p class=\"bill-meta\">Thank you for shopping at Terra &amp; Leaf!</p>";

  receipt.innerHTML = html;
}

// Print invoice (like Practical 01 window.print idea)
function printInvoice(){
  var receipt = document.getElementById("billReceipt");
  if (receipt.querySelector(".bill-receipt-placeholder") || !receipt.querySelector(".bill-total")){
    alert("Please calculate the bill first before printing.");
    return;
  }
  window.print();
}

function openInvoicePanel(){
  prefillInvoiceFromCart();
  var panel = document.getElementById("invoicePanel");
  var backdrop = document.getElementById("invoiceBackdrop");
  panel.classList.add("is-open");
  backdrop.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
}

function closeInvoicePanel(){
  var panel = document.getElementById("invoicePanel");
  var backdrop = document.getElementById("invoiceBackdrop");
  panel.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
}

function initInvoiceEvents(){
  document.getElementById("invoiceClose").addEventListener("click", closeInvoicePanel);
  document.getElementById("invoiceBackdrop").addEventListener("click", closeInvoicePanel);

  // Update line totals when qty changes
  document.getElementById("invoiceProductBody").addEventListener("input", function(e){
    if (e.target.classList.contains("inv-qty")){
      updateLineTotal(e.target.dataset.id);
    }
  });

  // Membership Yes → packing becomes 0 automatically
  document.querySelectorAll("input[name=\"membership\"]").forEach(function(radio){
    radio.addEventListener("change", function(){
      var packingField = document.getElementById("packing");
      if (document.querySelector("input[name=\"membership\"]:checked").value === "yes"){
        packingField.value = 0;
        packingField.readOnly = true;
      } else {
        packingField.value = 50;
        packingField.readOnly = false;
      }
    });
  });

  document.addEventListener("keydown", function(e){
    if (e.key === "Escape"){
      closeInvoicePanel();
    }
  });
}

/* ============ MOBILE NAV ============ */
function initNavToggle(){
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============ NEWSLETTER (demo, no backend) ============ */
function initNewsletter(){
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("newsletterMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "You're on the list — first note lands next month.";
    form.reset();
  });
}

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  initFilters();
  initCartEvents();
  initInvoiceEvents();
  initNavToggle();
  initNewsletter();
  updateCartUI();
});