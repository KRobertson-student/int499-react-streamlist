# Combined StreamList Final Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project` as a combined StreamList application that keeps the React StreamList app and replaces the Cart route with EZTech cart behavior.

**Architecture:** Use `int499-react-streamlist` as the host Vite React Router app. Port EZTech cart logic and product data into focused modules, then implement the existing `/cart` route as a catalog plus cart review page using localStorage persistence.

**Tech Stack:** Vite 5, React 18, React Router 6, Node test runner, custom CSS, GitHub CLI for repository creation.

---

## File Structure

- Create directory: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`
- Copy from: `C:\Users\rober\OneDrive\UAGC\INT 499\StreamList App\repo-main`
- Exclude from copy: `.git`, `node_modules`, `dist`
- Create: `Final Project/src/cartLogic.js`
- Create: `Final Project/src/cartProducts.js`
- Modify: `Final Project/src/pages/Cart.jsx`
- Modify: `Final Project/src/streamListUtils.test.mjs`
- Modify: `Final Project/src/index.css`
- Modify: `Final Project/src/components/Navbar.jsx`
- Modify: `Final Project/package.json`
- Modify: `Final Project/package-lock.json`
- Modify: `Final Project/README.md`
- Modify: `Final Project/.gitignore`

## Task 1: Create Final Project Workspace

**Files:**
- Create: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`
- Copy: source files from `C:\Users\rober\OneDrive\UAGC\INT 499\StreamList App\repo-main`

- [ ] **Step 1: Verify the destination does not already exist**

Run:

```powershell
Test-Path -LiteralPath 'C:\Users\rober\OneDrive\UAGC\INT 499\Final Project'
```

Expected: `False`

- [ ] **Step 2: Create the destination folder**

Run:

```powershell
New-Item -ItemType Directory -Path 'C:\Users\rober\OneDrive\UAGC\INT 499\Final Project'
```

Expected: directory created.

- [ ] **Step 3: Copy the React StreamList source without generated dependencies or Git history**

Run from `C:\Users\rober\OneDrive\UAGC\INT 499\StreamList App\repo-main`:

```powershell
$target = 'C:\Users\rober\OneDrive\UAGC\INT 499\Final Project'
Get-ChildItem -Force | Where-Object { $_.Name -notin @('.git', 'node_modules', 'dist') } | Copy-Item -Destination $target -Recurse -Force
```

Expected: final project contains app source, docs, package files, and config files.

- [ ] **Step 4: Verify copied files**

Run:

```powershell
Get-ChildItem -LiteralPath 'C:\Users\rober\OneDrive\UAGC\INT 499\Final Project' -Force
```

Expected: includes `src`, `docs`, `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `.gitignore`, and `README.md`; excludes `.git`, `node_modules`, and `dist`.

- [ ] **Step 5: Install dependencies in the final project folder**

Run from `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`:

```powershell
npm install
```

Expected: dependencies installed and `node_modules` created locally.

- [ ] **Step 6: Verify copied app baseline**

Run:

```powershell
npm test
npm run build
```

Expected: both PASS before cart integration begins.

## Task 2: Initialize Local Git Baseline

**Files:**
- Create: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\.git`

- [ ] **Step 1: Initialize Git**

Run from `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`:

```powershell
git init -b main
```

Expected: new Git repository initialized on `main`.

- [ ] **Step 2: Confirm generated folders are not tracked**

Run:

```powershell
git status --short
```

Expected: source files are untracked; `node_modules`, `dist`, and `.superpowers` are not listed.

- [ ] **Step 3: Commit copied base app**

Run:

```powershell
git add .
git commit -m "chore: copy StreamList base app"
```

Expected: baseline commit created before cart integration starts.

## Task 3: Add Failing Cart Logic Tests

**Files:**
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\streamListUtils.test.mjs`
- Test: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\streamListUtils.test.mjs`

- [ ] **Step 1: Add cart imports to the test file**

Add this import block after the existing `streamListUtils.js` import:

```js
import {
  addItemToCart,
  calculateCartTotal,
  getCartItemCount,
  loadCartItems,
  removeItemFromCart,
  saveCartItems,
  subscriptionWarning,
  updateCartQuantity,
} from './cartLogic.js';
```

- [ ] **Step 2: Add test product fixtures**

Add these fixtures after `createMemoryStorage`:

```js
const basicSubscription = {
  id: 1,
  category: 'subscription',
  service: 'Basic Subscription',
  serviceInfo: 'For one user',
  price: 4.99,
  img: 'basic.svg',
};

const premiumSubscription = {
  id: 3,
  category: 'subscription',
  service: 'Premium Subscription',
  serviceInfo: 'Share with the world',
  price: 12.99,
  img: 'premium.svg',
};

const shirt = {
  id: 5,
  category: 'accessory',
  service: 'EZ Tech T-Shirt',
  serviceInfo: 'Show your list to the world',
  price: 25.99,
  img: 'shirt.svg',
};
```

- [ ] **Step 3: Add cart behavior tests**

Append these tests to `src/streamListUtils.test.mjs`:

```js
test('addItemToCart adds one subscription and blocks a second subscription', () => {
  const firstResult = addItemToCart([], basicSubscription);
  const secondResult = addItemToCart(firstResult.cart, premiumSubscription);

  assert.deepEqual(firstResult.cart, [{ ...basicSubscription, quantity: 1 }]);
  assert.equal(firstResult.message, '');
  assert.deepEqual(secondResult.cart, firstResult.cart);
  assert.equal(secondResult.message, subscriptionWarning);
});

test('addItemToCart increments accessory quantity when added again', () => {
  const firstResult = addItemToCart([], shirt);
  const secondResult = addItemToCart(firstResult.cart, shirt);

  assert.deepEqual(secondResult.cart, [{ ...shirt, quantity: 2 }]);
  assert.equal(secondResult.message, '');
});

test('updateCartQuantity updates accessories and removes items at zero', () => {
  const cart = [
    { ...basicSubscription, quantity: 1 },
    { ...shirt, quantity: 2 },
  ];

  const updatedCart = updateCartQuantity(cart, shirt.id, 3);
  const removedCart = updateCartQuantity(updatedCart, shirt.id, 0);

  assert.equal(updatedCart.find((item) => item.id === shirt.id).quantity, 3);
  assert.deepEqual(removedCart, [{ ...basicSubscription, quantity: 1 }]);
});

test('updateCartQuantity keeps subscription quantity at one', () => {
  const cart = [{ ...basicSubscription, quantity: 1 }];

  assert.deepEqual(updateCartQuantity(cart, basicSubscription.id, 2), cart);
});

test('removeItemFromCart removes only the matching item', () => {
  const cart = [
    { ...basicSubscription, quantity: 1 },
    { ...shirt, quantity: 2 },
  ];

  assert.deepEqual(removeItemFromCart(cart, basicSubscription.id), [
    { ...shirt, quantity: 2 },
  ]);
});

test('getCartItemCount and calculateCartTotal summarize cart contents', () => {
  const cart = [
    { ...basicSubscription, quantity: 1 },
    { ...shirt, quantity: 3 },
  ];

  assert.equal(getCartItemCount(cart), 4);
  assert.equal(calculateCartTotal(cart), 82.96);
});

test('loadCartItems restores valid cart data from storage', () => {
  const savedCart = [{ ...shirt, quantity: 2 }];
  const storage = createMemoryStorage({
    streamlist_cart: JSON.stringify(savedCart),
  });

  assert.deepEqual(loadCartItems(storage), savedCart);
});

test('loadCartItems falls back when stored cart data is invalid', () => {
  const fallbackCart = [{ ...basicSubscription, quantity: 1 }];
  const storage = createMemoryStorage({
    streamlist_cart: JSON.stringify([{ id: 1, service: '', price: 'free' }]),
  });

  assert.deepEqual(loadCartItems(storage, fallbackCart), fallbackCart);
});

test('saveCartItems stores cart data and reports success', () => {
  const storage = createMemoryStorage();
  const cart = [{ ...shirt, quantity: 2 }];

  assert.equal(saveCartItems(storage, cart), true);
  assert.equal(storage.getItem('streamlist_cart'), JSON.stringify(cart));
});
```

- [ ] **Step 4: Run tests to verify RED**

Run from `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`:

```powershell
npm test
```

Expected: FAIL because `src/cartLogic.js` does not exist yet.

## Task 4: Implement Cart Logic

**Files:**
- Create: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\cartLogic.js`
- Test: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\streamListUtils.test.mjs`

- [ ] **Step 1: Create `src/cartLogic.js`**

Add this complete file:

```js
export const CART_STORAGE_KEY = 'streamlist_cart';

export const subscriptionWarning =
  'Only one subscription can be in your cart at a time. Remove the current subscription before adding another.';

function normalizeQuantity(quantity) {
  const parsedQuantity = Number(quantity);

  if (!Number.isFinite(parsedQuantity)) {
    return 0;
  }

  return Math.floor(parsedQuantity);
}

function isCartItem(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id !== 'undefined' &&
    typeof value.category === 'string' &&
    typeof value.service === 'string' &&
    value.service.trim().length > 0 &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    normalizeQuantity(value.quantity) > 0
  );
}

function normalizeCartItem(item) {
  return {
    id: item.id,
    category: item.category,
    service: item.service,
    serviceInfo: typeof item.serviceInfo === 'string' ? item.serviceInfo : '',
    price: item.price,
    img: typeof item.img === 'string' ? item.img : '',
    quantity: item.category === 'subscription' ? 1 : normalizeQuantity(item.quantity),
  };
}

export function addItemToCart(cart, product) {
  const hasSubscription = cart.some((item) => item.category === 'subscription');

  if (product.category === 'subscription' && hasSubscription) {
    return {
      cart,
      message: subscriptionWarning,
    };
  }

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    return {
      cart: cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
      message: '',
    };
  }

  return {
    cart: [...cart, { ...product, quantity: 1 }],
    message: '',
  };
}

export function removeItemFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function updateCartQuantity(cart, productId, quantity) {
  const nextQuantity = normalizeQuantity(quantity);

  if (nextQuantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.id === productId
      ? {
          ...item,
          quantity: item.category === 'subscription' ? 1 : nextQuantity,
        }
      : item,
  );
}

export function getCartItemCount(cart) {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export function calculateCartTotal(cart) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return Number(total.toFixed(2));
}

export function loadCartItems(storage, fallbackCart = []) {
  if (!storage) {
    return fallbackCart;
  }

  try {
    const storedCart = storage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return fallbackCart;
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart) || !parsedCart.every(isCartItem)) {
      return fallbackCart;
    }

    return parsedCart.map(normalizeCartItem);
  } catch {
    return fallbackCart;
  }
}

export function saveCartItems(storage, cart) {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Run tests to verify GREEN**

Run:

```powershell
npm test
```

Expected: PASS with 22 tests.

- [ ] **Step 3: Commit cart logic**

Run:

```powershell
git add src/streamListUtils.test.mjs src/cartLogic.js
git commit -m "feat: add cart logic helpers"
```

Expected: commit created in the Final Project repository.

## Task 5: Add EZTech Product Catalog

**Files:**
- Create: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\cartProducts.js`

- [ ] **Step 1: Add product catalog data**

Create `src/cartProducts.js` with this complete file:

```js
const productImage = (title, subtitle, accent, background) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <rect width="320" height="220" rx="18" fill="${background}" />
      <circle cx="262" cy="50" r="36" fill="${accent}" opacity="0.16" />
      <circle cx="64" cy="164" r="44" fill="${accent}" opacity="0.12" />
      <rect x="44" y="42" width="232" height="136" rx="18" fill="#ffffff" stroke="${accent}" stroke-width="4" />
      <rect x="72" y="74" width="176" height="18" rx="9" fill="${accent}" opacity="0.9" />
      <rect x="72" y="112" width="120" height="12" rx="6" fill="#94a3b8" />
      <rect x="72" y="138" width="88" height="12" rx="6" fill="#cbd5e1" />
      <text x="160" y="202" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#172033">${title}</text>
      <text x="160" y="27" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${accent}">${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const products = [
  {
    id: 1,
    category: 'subscription',
    service: 'Basic Subscription',
    serviceInfo: 'For one user',
    price: 4.99,
    img: productImage('Basic', 'Subscription', '#1267ce', '#eaf3ff'),
  },
  {
    id: 2,
    category: 'subscription',
    service: 'Gold Subscription',
    serviceInfo: 'Share with family',
    price: 9.99,
    img: productImage('Gold', 'Subscription', '#b7791f', '#fff7ed'),
  },
  {
    id: 3,
    category: 'subscription',
    service: 'Premium Subscription',
    serviceInfo: 'Share with the world',
    price: 12.99,
    img: productImage('Premium', 'Subscription', '#047857', '#ecfdf5'),
  },
  {
    id: 4,
    category: 'subscription',
    service: 'Social Media Sharing Subscription',
    serviceInfo: 'Share your list',
    price: 2.99,
    img: productImage('Social', 'Sharing', '#7c3aed', '#f5f3ff'),
  },
  {
    id: 5,
    category: 'accessory',
    service: 'EZ Tech T-Shirt',
    serviceInfo: 'Show your list to the world',
    price: 25.99,
    img: productImage('T-Shirt', 'Accessory', '#db2777', '#fdf2f8'),
  },
  {
    id: 6,
    category: 'accessory',
    service: 'EZ Techplosion',
    serviceInfo: 'Share your list with all',
    price: 25.99,
    img: productImage('Techplosion', 'Accessory', '#ea580c', '#fff7ed'),
  },
  {
    id: 7,
    category: 'accessory',
    service: 'EZ Techmerizing',
    serviceInfo: 'Techmerize your friends',
    price: 25.99,
    img: productImage('Techmerizing', 'Accessory', '#0f766e', '#f0fdfa'),
  },
  {
    id: 8,
    category: 'accessory',
    service: 'EZ Tech Case',
    serviceInfo: 'Mesmerize your friends',
    price: 20.99,
    img: productImage('Case', 'Accessory', '#475569', '#f8fafc'),
  },
];

export default products;
```

- [ ] **Step 2: Run tests**

Run:

```powershell
npm test
```

Expected: PASS with 22 tests.

- [ ] **Step 3: Commit product catalog**

Run:

```powershell
git add src/cartProducts.js
git commit -m "feat: add EZTech product catalog"
```

Expected: commit created.

## Task 6: Implement Cart Page UI

**Files:**
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\pages\Cart.jsx`

- [ ] **Step 1: Replace `src/pages/Cart.jsx`**

Replace the complete file with:

```jsx
import { useEffect, useMemo, useState } from 'react';
import {
  addItemToCart,
  calculateCartTotal,
  getCartItemCount,
  loadCartItems,
  removeItemFromCart,
  saveCartItems,
  updateCartQuantity,
} from '../cartLogic.js';
import products from '../cartProducts.js';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function getBrowserStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function ProductSection({
  title,
  description,
  products,
  onAddItem,
  warningMessage = '',
}) {
  return (
    <article className="panel cart-product-section">
      <div className="list-header">
        <div>
          <p className="page-kicker">EZTechMovie</p>
          <h3 className="section-title">{title}</h3>
        </div>
      </div>

      <p className="page-copy cart-section-copy">{description}</p>

      {warningMessage ? (
        <p className="message message--warning" role="alert">
          {warningMessage}
        </p>
      ) : null}

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-card__image-wrap">
              <img src={product.img} alt="" className="product-card__image" />
            </div>

            <div className="product-card__body">
              <span className="category-label">{product.category}</span>
              <h4>{product.service}</h4>
              <p>{product.serviceInfo}</p>

              <div className="product-card__footer">
                <strong>{money.format(product.price)}</strong>
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={() => onAddItem(product)}
                >
                  <span className="material-symbols-rounded" aria-hidden="true">
                    add_shopping_cart
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

function CartReview({ cart, cartTotal, onQuantityChange, onRemoveItem }) {
  return (
    <article className="panel cart-review-panel">
      <div className="cart-heading">
        <div>
          <p className="page-kicker">Cart Review</p>
          <h3 className="section-title">Your cart</h3>
        </div>
        <strong>{money.format(cartTotal)}</strong>
      </div>

      {cart.length ? (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.img} alt="" className="cart-item__image" />

                <div className="cart-item__details">
                  <span className="category-label">{item.category}</span>
                  <h4>{item.service}</h4>
                  <p>{money.format(item.price)} each</p>
                </div>

                <div
                  className="quantity-control"
                  aria-label={`${item.service} quantity`}
                >
                  <button
                    type="button"
                    aria-label={`Decrease ${item.service} quantity`}
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">
                      remove
                    </span>
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.service} quantity`}
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.category === 'subscription'}
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">
                      add
                    </span>
                  </button>
                </div>

                <strong className="line-total">
                  {money.format(item.price * item.quantity)}
                </strong>

                <button
                  className="icon-btn icon-btn--danger"
                  type="button"
                  aria-label={`Remove ${item.service}`}
                  title={`Remove ${item.service}`}
                  onClick={() => onRemoveItem(item.id)}
                >
                  <span className="material-symbols-rounded" aria-hidden="true">
                    delete
                  </span>
                </button>
              </article>
            ))}
          </div>

          <footer className="cart-summary">
            <span>Total</span>
            <strong>{money.format(cartTotal)}</strong>
          </footer>
        </>
      ) : (
        <p className="empty-state">
          Your cart is empty. Add a subscription or accessory to get started.
        </p>
      )}
    </article>
  );
}

function Cart() {
  const [cart, setCart] = useState(() => loadCartItems(getBrowserStorage()));
  const [notice, setNotice] = useState('');

  const subscriptions = useMemo(
    () => products.filter((product) => product.category === 'subscription'),
    [],
  );
  const accessories = useMemo(
    () => products.filter((product) => product.category === 'accessory'),
    [],
  );
  const itemCount = getCartItemCount(cart);
  const cartTotal = calculateCartTotal(cart);
  const isSubscriptionWarning = notice.includes('Only one subscription');

  useEffect(() => {
    saveCartItems(getBrowserStorage(), cart);
  }, [cart]);

  const handleAddItem = (product) => {
    const result = addItemToCart(cart, product);

    setCart(result.cart);
    setNotice(result.message || `${product.service} added to your cart.`);
  };

  const handleRemoveItem = (productId) => {
    setCart((currentCart) => removeItemFromCart(currentCart, productId));
    setNotice('Item removed from your cart.');
  };

  const handleQuantityChange = (productId, quantity) => {
    setCart((currentCart) => updateCartQuantity(currentCart, productId, quantity));
    setNotice('');
  };

  return (
    <section className="cart-page">
      <article className="panel cart-intro-panel">
        <p className="page-kicker">Week 4</p>
        <h2 className="page-title">Build your StreamList cart</h2>
        <p className="page-copy">
          Choose one EZTechMovie subscription, add accessories, and review your
          cart total before checkout.
        </p>
        <p className="helper-text">
          {itemCount} cart items. Current total: {money.format(cartTotal)}.
        </p>
        {notice && !isSubscriptionWarning ? (
          <p className="message message--success" role="status">
            {notice}
          </p>
        ) : null}
      </article>

      <ProductSection
        title="Subscription Plans"
        description="Only one subscription can be active in the cart at a time."
        products={subscriptions}
        onAddItem={handleAddItem}
        warningMessage={isSubscriptionWarning ? notice : ''}
      />

      <ProductSection
        title="EZ Tech Accessories"
        description="Accessories can be added multiple times and adjusted in the cart."
        products={accessories}
        onAddItem={handleAddItem}
      />

      <CartReview
        cart={cart}
        cartTotal={cartTotal}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
      />
    </section>
  );
}

export default Cart;
```

- [ ] **Step 2: Build to expose JSX errors**

Run:

```powershell
npm run build
```

Expected: FAIL because CSS does not exist yet is acceptable only if Vite still builds; JSX/import errors must be fixed before continuing.

## Task 7: Add Cart Styling

**Files:**
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\index.css`

- [ ] **Step 1: Add warning color variables**

In `:root`, add:

```css
  --warning: #9a3412;
  --warning-soft: #fff7ed;
```

- [ ] **Step 2: Add warning message style after `.message--success`**

Add:

```css
.message--warning {
  border: 1px solid #fed7aa;
  background: var(--warning-soft);
  color: var(--warning);
}
```

- [ ] **Step 3: Add cart page styles before `.placeholder-page`**

Add:

```css
.cart-page {
  display: grid;
  gap: 1rem;
}

.cart-intro-panel,
.cart-product-section,
.cart-review-panel {
  display: grid;
  gap: 1rem;
}

.cart-section-copy {
  margin-top: 0;
}

.category-label {
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.85rem;
}

.product-card {
  min-height: 100%;
  display: grid;
  grid-template-rows: 9rem 1fr;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #f8fafc;
}

.product-card__image-wrap {
  display: grid;
  place-items: center;
  padding: 1rem;
  background: #ffffff;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-card__body {
  display: grid;
  gap: 0.55rem;
  padding: 1rem;
}

.product-card h4,
.cart-item h4 {
  color: var(--ink);
  font-size: 1.05rem;
  line-height: 1.2;
}

.product-card p,
.cart-item p {
  color: var(--muted);
}

.product-card__footer {
  align-self: end;
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.product-card__footer strong,
.cart-heading strong,
.cart-summary strong,
.line-total {
  color: var(--ink);
  font-size: 1.15rem;
}

.product-card .btn {
  gap: 0.45rem;
}

.cart-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.cart-items {
  display: grid;
  gap: 0.85rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr) auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #f8fafc;
}

.cart-item__image {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  border-radius: 8px;
  background: #ffffff;
}

.cart-item__details {
  min-width: 0;
  display: grid;
  gap: 0.25rem;
}

.quantity-control {
  display: grid;
  grid-template-columns: 2.25rem 2.25rem 2.25rem;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #ffffff;
}

.quantity-control button,
.quantity-control span {
  min-height: 2.4rem;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-weight: 900;
}

.quantity-control button:hover:not(:disabled) {
  background: var(--accent-soft);
  color: var(--accent);
}

.cart-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-weight: 800;
}
```

- [ ] **Step 4: Add cart responsive rules inside `@media (max-width: 720px)`**

Add these rules within the existing mobile media query:

```css
  .cart-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .cart-item {
    grid-template-columns: 4.5rem minmax(0, 1fr);
  }

  .quantity-control,
  .line-total,
  .cart-item .icon-btn {
    grid-column: 2;
    width: fit-content;
  }
```

- [ ] **Step 5: Run build**

Run:

```powershell
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit Cart page and styling**

Run:

```powershell
git add src/pages/Cart.jsx src/index.css
git commit -m "feat: build cart page"
```

Expected: commit created.

## Task 8: Update Project Metadata And Docs

**Files:**
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\src\components\Navbar.jsx`
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\package.json`
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\package-lock.json`
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\README.md`
- Modify: `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project\.gitignore`

- [ ] **Step 1: Update Navbar subtitle**

In `src/components/Navbar.jsx`, replace:

```jsx
<p className="brand__subtitle">React Router navigation project</p>
```

With:

```jsx
<p className="brand__subtitle">Final StreamList capstone project</p>
```

- [ ] **Step 2: Update package name**

In `package.json`, replace:

```json
"name": "streamlist",
```

With:

```json
"name": "final-streamlist",
```

- [ ] **Step 3: Update package-lock root package name**

In `package-lock.json`, replace the root package `"name"` values from `streamlist` to `final-streamlist` where they identify the package itself.

- [ ] **Step 4: Add `.superpowers/` to `.gitignore`**

Append:

```gitignore
.superpowers/
```

- [ ] **Step 5: Replace README with final-project documentation**

Replace `README.md` with:

```markdown
# Final StreamList

Final StreamList combines the routed React StreamList application with the EZTechMovie cart assignment into one Vite React capstone project.

## Features

- StreamList watchlist manager with add, edit, delete, complete, filter, and localStorage behavior
- TMDB movie search page with recent searches, result details, poster display, and localStorage persistence
- EZTechMovie cart page with subscription plans, accessories, quantity controls, remove actions, totals, and localStorage persistence
- Subscription guard that allows only one subscription in the cart at a time
- Responsive custom CSS and React Router navigation
- Automated helper tests for StreamList, TMDB formatting, and cart logic

## Repositories Combined

- `int499-react-streamlist`
- `int499-eztechmovie-streamlist`

## Run Locally

Install dependencies:

```bash
npm install
```

Create a local `.env` file with a TMDB API key before using the Movies search page:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Notes

This product uses the TMDB API but is not endorsed or certified by TMDB. The cart demonstrates local checkout behavior only and does not process payments.
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm test
npm run build
```

Expected: both PASS.

- [ ] **Step 7: Commit metadata and documentation**

Run:

```powershell
git add src/components/Navbar.jsx package.json package-lock.json README.md .gitignore
git commit -m "docs: update final project metadata"
```

Expected: commit created.

## Task 9: Manual Browser Verification

**Files:**
- Verify app behavior in `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`

- [ ] **Step 1: Start the development server**

Run:

```powershell
npm run dev
```

Expected: Vite provides a local URL, usually `http://localhost:5173/`.

- [ ] **Step 2: Verify StreamList route**

Open the local URL and verify:

- StreamList page loads at `#/`.
- A new title can be added.
- The title can be marked complete.
- The title can be deleted.

- [ ] **Step 3: Verify Movies route**

Navigate to `#/movies` and verify:

- The Movies page loads.
- If no TMDB key is configured, submitting a search shows the existing configuration message instead of crashing.

- [ ] **Step 4: Verify Cart route**

Navigate to `#/cart` and verify:

- Subscription and accessory cards render.
- Adding one subscription updates cart count and total.
- Adding a second subscription shows the warning and leaves the cart unchanged.
- Adding the same accessory twice increments quantity.
- Decreasing quantity updates totals.
- Removing an item removes only that item.
- Refreshing the page preserves cart contents.

- [ ] **Step 5: Stop the development server**

Use `Ctrl+C` in the terminal running Vite.

## Task 10: Review Final Git Repository Before Remote

**Files:**
- Remote: `https://github.com/KRobertson-student/int499-final-streamlist.git`

- [ ] **Step 1: Review recent commits**

Run from `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`:

```powershell
git log --oneline -5
```

Expected: shows the baseline copy commit plus cart integration commits.

- [ ] **Step 2: Confirm working tree is clean**

Run:

```powershell
git status --short
```

Expected: no uncommitted files.

## Task 11: Create And Push New GitHub Repository

**Files:**
- Remote repository: `KRobertson-student/int499-final-streamlist`

- [ ] **Step 1: Confirm GitHub CLI auth**

Run:

```powershell
gh auth status
```

Expected: authenticated to GitHub as an account that can create repositories under `KRobertson-student`.

- [ ] **Step 2: Create the public repository and push**

Run from `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project`:

```powershell
gh repo create KRobertson-student/int499-final-streamlist --public --source . --remote origin --push
```

Expected: GitHub repository created, `origin` remote added, and `main` pushed.

- [ ] **Step 3: Verify remote**

Run:

```powershell
git remote -v
git status --short --branch
```

Expected: `origin` points to `https://github.com/KRobertson-student/int499-final-streamlist.git`; branch is clean and tracking `origin/main`.

## Task 12: Final Verification

**Files:**
- Verify: final project source, tests, build, Git status, remote

- [ ] **Step 1: Run final tests**

Run:

```powershell
npm test
```

Expected: PASS with all StreamList, TMDB, and cart logic tests.

- [ ] **Step 2: Run final production build**

Run:

```powershell
npm run build
```

Expected: PASS and `dist/` generated locally.

- [ ] **Step 3: Confirm Git stays clean after build**

Run:

```powershell
git status --short --branch
```

Expected: clean working tree; `dist/` ignored.

- [ ] **Step 4: Record result for user**

Report:

- Final project folder path.
- New GitHub repository URL.
- Tests run and result.
- Build run and result.
- Any verification that could not be completed.
