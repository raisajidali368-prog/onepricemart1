// =======================================
// One Price Mart - app.js
// Pure JS: products, filters, cart, UI effects
// =======================================

const PRICE = 275;

// Sticky header state
const header = document.getElementById('siteHeader');
const onScroll = () => {
  const solid = window.scrollY > 10;
  header.classList.toggle('solid', solid);
  header.classList.toggle('transparent', !solid);
};
window.addEventListener('scroll', onScroll);
onScroll();

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sample Products (24+)
const products = [
  { id: 1,  name: 'Microfiber Cloth 2-Pack',         category: 'Cleaning',     img: 'https://picsum.photos/seed/clean1/600/600' },
  { id: 2,  name: 'Dish Sponge Set',                 category: 'Kitchen',      img: 'https://picsum.photos/seed/kitchen1/600/600' },
  { id: 3,  name: 'Plastic Storage Box',             category: 'Storage',      img: 'https://picsum.photos/seed/storage1/600/600' },
  { id: 4,  name: 'Hand Soap Dispenser',             category: 'Personal Care',img: 'https://picsum.photos/seed/care1/600/600' },
  { id: 5,  name: 'Steel Scrubber',                  category: 'Kitchen',      img: 'https://picsum.photos/seed/kitchen2/600/600' },
  { id: 6,  name: 'All-Purpose Cleaner 500ml',       category: 'Cleaning',     img: 'https://picsum.photos/seed/clean2/600/600' },
  { id: 7,  name: 'Zip Seal Bags (Medium)',          category: 'Storage',      img: 'https://picsum.photos/seed/storage2/600/600' },
  { id: 8,  name: 'Toothbrush 3-Pack',               category: 'Personal Care',img: 'https://picsum.photos/seed/care2/600/600' },
  { id: 9,  name: 'Kitchen Tongs',                   category: 'Kitchen',      img: 'https://picsum.photos/seed/kitchen3/600/600' },
  { id: 10, name: 'Scrub Brush',                     category: 'Cleaning',     img: 'https://picsum.photos/seed/clean3/600/600' },
  { id: 11, name: 'Stackable Organizer',             category: 'Storage',      img: 'https://picsum.photos/seed/storage3/600/600' },
  { id: 12, name: 'Face Towels (2)',                 category: 'Personal Care',img: 'https://picsum.photos/seed/care3/600/600' },
  { id: 13, name: 'Measuring Cups Set',              category: 'Kitchen',      img: 'https://picsum.photos/seed/kitchen4/600/600' },
  { id: 14, name: 'Glass Cleaner Spray',             category: 'Cleaning',     img: 'https://picsum.photos/seed/clean4/600/600' },
  { id: 15, name: 'Under-bed Storage Bag',           category: 'Storage',      img: 'https://picsum.photos/seed/storage4/600/600' },
  { id: 16, name: 'Comb & Mirror Set',               category: 'Personal Care',img: 'https://picsum.photos/seed/care4/600/600' },
  { id: 17, name: 'Silicone Spatula',                category: 'Kitchen',      img: 'https://picsum.photos/seed/kitchen5/600/600' },
  { id: 18, name: 'Floor Mop Refill',                category: 'Cleaning',     img: 'https://picsum.photos/seed/clean5/600/600' },
  { id: 19, name: 'Drawer Dividers',                 category: 'Storage',      img: 'https://picsum.photos/seed/storage5/600/600' },
  { id: 20, name: 'Cotton Swabs 200pc',              category: 'Personal Care',img: 'https://picsum.photos/seed/care5/600/600' },
  { id: 21, name: 'Vegetable Peeler',                category: 'Kitchen',      img: 'https://picsum.photos/seed/kitchen6/600/600' },
  { id: 22, name: 'Bathroom Cleaner Pad',            category: 'Cleaning',     img: 'https://picsum.photos/seed/clean6/600/600' },
  { id: 23, name: 'Folding Storage Crate',           category: 'Storage',      img: 'https://picsum.photos/seed/storage6/600/600' },
  { id: 24, name: 'Hand Sanitizer 100ml',            category: 'Personal Care',img: 'https://picsum.photos/seed/care6/600/600' },
];

// Render Products
const grid = document.getElementById('productGrid');
function createProductCard(p){
  const item = document.createElement('div');
  item.className = 'card product-card reveal';
  item.dataset.category = p.category;

  item.innerHTML = `
    <div class="product-media">
      <img src="${p.img}" alt="${p.name}" loading="lazy"/>
      <span class="price-badge">PKR ${PRICE}</span>
      <button class="btn btn-primary add-btn" data-id="${p.id}">Add to Cart</button>
    </div>
    <div class="product-body">
      <h3 class="product-name">${p.name}</h3>
    </div>
  `;
  return item;
}
function renderProducts(list){
  grid.innerHTML = '';
  list.forEach(p => grid.appendChild(createProductCard(p)));
  // re-attach reveal observer
  document.querySelectorAll('.product-card.reveal').forEach(el => io.observe(el));
}
renderProducts(products);

// Filters
const filterButtons = document.querySelectorAll('.chip');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    if(f === 'all'){ renderProducts(products); }
    else{ renderProducts(products.filter(p => p.category === f)); }
  });
});

// Mini Cart
let cart = {}; // { id: { ...product, qty } }

const cartFab = document.getElementById('cartFab');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

function openCart(){
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCart(){
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden', 'true');
}
cartFab.addEventListener('click', openCart);
overlay.addEventListener('click', closeCart);
closeCartBtn.addEventListener('click', closeCart);

function updateCartUI(){
  // items
  cartItemsEl.innerHTML = '';
  const entries = Object.values(cart);
  if(!entries.length){
    cartItemsEl.innerHTML = '<p class="muted">Your cart is empty. Add some items!</p>';
  }else{
    entries.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <div class="qty" data-id="${item.id}">
            <button class="dec" aria-label="Decrease">−</button>
            <span class="q">${item.qty}</span>
            <button class="inc" aria-label="Increase">+</button>
          </div>
        </div>
        <strong>PKR ${(item.qty * PRICE).toLocaleString()}</strong>
      `;
      cartItemsEl.appendChild(row);
    });
  }

  // total
  const total = entries.reduce((sum, i) => sum + i.qty * PRICE, 0);
  cartTotalEl.textContent = `PKR ${total.toLocaleString()}`;
  // count
  const count = entries.reduce((n, i) => n + i.qty, 0);
  cartCountEl.textContent = count;
}

function addToCart(id){
  const product = products.find(p => p.id === id);
  if(!product) return;
  if(!cart[id]) cart[id] = { ...product, qty: 0 };
  cart[id].qty += 1;
  updateCartUI();
}

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if(btn){
    const id = parseInt(btn.dataset.id, 10);
    addToCart(id);
  }
});

cartItemsEl.addEventListener('click', (e) => {
  const parent = e.target.closest('.qty');
  if(!parent) return;
  const id = parseInt(parent.dataset.id, 10);
  if(e.target.classList.contains('inc')){
    cart[id].qty += 1;
  }else if(e.target.classList.contains('dec')){
    cart[id].qty -= 1;
    if(cart[id].qty <= 0) delete cart[id];
  }
  updateCartUI();
});

// Checkout (placeholder)
document.getElementById('checkoutBtn').addEventListener('click', () => {
  alert('Checkout is a demo. Integrate your payment gateway or order flow later.');
});

// Contact form (client-side check only)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  let ok = true;

  const setError = (field, msg) => {
    contactForm.querySelector(`.error[data-for="${field}"]`).textContent = msg || '';
  };

  setError('name', '');
  setError('email', '');
  setError('message', '');

  if(!name){ setError('name', 'Please enter your name'); ok = false; }
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('email', 'Enter a valid email'); ok = false; }
  if(!message){ setError('message', 'Please write a message'); ok = false; }

  if(ok){
    alert('Thanks! This is a demo form — hook it to your backend later.');
    contactForm.reset();
  }
});
