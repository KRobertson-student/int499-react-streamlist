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

  try {
    return window.localStorage;
  } catch {
    return null;
  }
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
    setCart((currentCart) =>
      updateCartQuantity(currentCart, productId, quantity),
    );
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
