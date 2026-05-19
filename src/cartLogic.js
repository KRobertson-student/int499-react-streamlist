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
    quantity:
      item.category === 'subscription' ? 1 : normalizeQuantity(item.quantity),
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
