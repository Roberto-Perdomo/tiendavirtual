// Simula una base de datos
const products = [
  { id: 1, name: "Nike Air Max", price: 120, img: "img/zapatoverde.png", description: "Zapatillas Nike Air Max para correr cómodamente." },
  { id: 2, name: "Nike Revolution", price: 90, img: "img/zapatoCarrito.jpg", description: "Ideales para entrenamientos y uso diario." },
  { id: 3, name: "Nike Zoom", price: 150, img: "img/zapatoCarrito.jpg", description: "Tecnología Zoom para máximo rendimiento." },
  { id: 4, name: "Nike React", price: 110, img: "img/r2.png", description: "Diseño liviano y gran amortiguación." },
  { id: 5, name: "Nike Pegasus", price: 130, img: "img/retro2.png", description: "Velocidad y confort para corredores exigentes." }
];

const cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

// Detectar página
const productList = document.getElementById("product-list");

if (productList) {
  renderProductList();
} else {
  renderProductDetails();
}

function renderProductList() {
  productList.innerHTML = "";
  products.forEach(product => {
    const productEl = document.createElement("div");
    productEl.className = "product-card";
    productEl.innerHTML = `
      <img src="${product.img}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Agregar al carrito</button>
      <button onclick="openProductModal(${product.id})">Ver más</button>
    `;
    productList.appendChild(productEl);
  });
}

function renderProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const product = products.find(p => p.id === productId);
  const productDetail = document.getElementById("product-detail");

  if (productDetail) {
    if (product) {
      productDetail.innerHTML = `
        <div class="product">
          <img src="${product.img}" alt="${product.name}" />
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p><strong>Precio:</strong> $${product.price}</p>
          <button class="btn-agregar" onclick="addToCart(${product.id})">Agregar al carrito</button>
        </div>
      `;
    } else {
      productDetail.innerHTML = "<p>Producto no encontrado.</p>";
    }
  }
}

function addToCart(id) {
  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  renderCart();
  showSuccessMessage();
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function toggleCartModal() {
  const modal = document.getElementById("cart-modal");
  if (modal) {
    modal.classList.toggle("hidden");
    renderCart();
  }
}

function renderCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty-message'>Tu carrito está vacío.</p>";
    cartTotal.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.img}" alt="${item.name}" />
        <span>${item.name} - $${item.price}</span>
      </div>
      <div class="cart-item-actions">
        <button onclick="decreaseQuantity(${index})">−</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
        <button onclick="removeFromCart(${index})">🗑</button>
      </div>
    `;
    cartItems.appendChild(itemEl);
  });

  cartTotal.textContent = total;

  // Formulario de checkout
  const formHTML = `
    <form class="checkout-form">
      <h3>Datos para el pedido</h3>
      <input type="text" id="first-name" placeholder="Nombre" required />
      <input type="text" id="last-name" placeholder="Apellido" required />
      <input type="email" id="email" placeholder="Correo electrónico" required />
      <textarea id="message" placeholder="Mensaje (opcional)"></textarea>
    </form>
  `;
  cartItems.insertAdjacentHTML("beforeend", formHTML);
}

function increaseQuantity(index) {
  cart[index].quantity++;
  renderCart();
  updateCartCount();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
  updateCartCount();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  updateCartCount();
}

function checkout() {
  if (cart.length === 0) return;

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");

  if (!firstName || !lastName || !email) {
    alert("Completa tus datos antes de pagar.");
    return;
  }

  if (
    firstName.value.trim() === "" ||
    lastName.value.trim() === "" ||
    email.value.trim() === ""
  ) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }

  // Cerrar carrito primero de forma segura
  const cartModal = document.getElementById("cart-modal");
  if (cartModal && !cartModal.classList.contains("hidden")) {
    cartModal.classList.add("hidden");
  }

  // Mostrar modal de éxito
  const successModal = document.getElementById("checkout-success-modal");
  successModal.classList.remove("hidden");

  // Vaciar y actualizar carrito
  cart.length = 0;
  renderCart();
  updateCartCount();

  // Ocultar modal de éxito luego de 3 segundos
  setTimeout(() => {
    successModal.classList.add("hidden");
  }, 3000);
}

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  const modal = document.getElementById("product-modal");
  const content = document.getElementById("modal-product-content");

  if (product && modal && content) {
    content.innerHTML = `
      <img src="${product.img}" alt="${product.name}" style="max-width: 100%; border-radius: 10px; margin-bottom: 20px;" />
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
      <button onclick="addToCart(${product.id})">Agregar al carrito</button>
    `;
    modal.classList.remove("hidden");
  }
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function showSuccessMessage() {
  const msg = document.getElementById("success-message");
  msg.classList.remove("hidden");
  setTimeout(() => {
    msg.classList.add("hidden");
  }, 2500);
}

function goHome() {
  toggleCartModal();
}