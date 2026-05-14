# Combined StreamList Final Project Design

## Purpose

Build a final combined StreamList application from two existing repositories:

- `int499-react-streamlist`: the routed StreamList application with watchlist management, TMDB movie search, persistence utilities, tests, and GitHub Pages-oriented structure.
- `int499-eztechmovie-streamlist`: the EZTech cart application with product catalog data, cart logic, subscription rules, localStorage persistence, cart totals, and automated cart tests.

The final application will live locally in `C:\Users\rober\OneDrive\UAGC\INT 499\Final Project` and will be published to a new GitHub repository named `KRobertson-student/int499-final-streamlist`.

## Recommended Approach

Use `int499-react-streamlist` as the base application and integrate the EZTech cart as the implementation for the existing `/cart` route.

This approach keeps the strongest existing application shell: React Router routes, the StreamList page, the Movies page, the About page, current styling conventions, and the existing Node-based helper tests. EZTech cart code is best treated as a feature module that supplies catalog data, cart behavior, persistence, and UI patterns for the Cart page.

## Architecture

The combined app will remain a Vite React single-page application using `HashRouter` for GitHub Pages compatibility. Route ownership stays simple:

- `/`: StreamList watchlist manager.
- `/movies`: TMDB movie search and result review.
- `/cart`: EZTech subscriptions, accessories, and cart checkout review.
- `/about`: project/about content.
- `*`: not-found recovery route.

Cart-specific logic will be separated from the React component so it can be tested directly. Product catalog data will also remain separate from UI code, making the Cart page easier to scan and maintain.

## Components And Files

The final project will be created by copying the current React StreamList project into `Final Project`, then adding or modifying these files:

- `src/pages/Cart.jsx`: replace the current placeholder page with a real catalog/cart page using EZTech behavior.
- `src/cartLogic.js`: add cart helper functions adapted from EZTech.
- `src/cartProducts.js`: add EZTech subscription and accessory product data.
- `src/streamListUtils.test.mjs`: expand the existing Node test suite to include cart logic tests.
- `src/index.css`: add Cart page, product card, quantity control, warning, and summary styles that fit the existing StreamList visual system.
- `src/components/Navbar.jsx`: update the subtitle to `Final StreamList capstone project`, while keeping the same route navigation.
- `README.md`: document that the final project combines StreamList, TMDB movie search, and EZTech cart behavior.
- `package.json`: rename the app for the final project and keep scripts simple.

## Cart Behavior

The Cart page will preserve the EZTech behavior:

- Products are grouped into subscriptions and accessories.
- Only one subscription may be in the cart at a time.
- Attempting to add a second subscription shows a visible warning and leaves the cart unchanged.
- Adding the same accessory increments its quantity.
- Cart items can be removed.
- Accessory quantities can be increased or decreased.
- Decreasing an item to zero removes it.
- Subscription quantity cannot be increased past one.
- Item count and cart total are calculated from cart contents.
- Cart contents persist in localStorage after refresh.

The cart storage key will be `streamlist_cart` instead of reusing `eztech-cart`.

## UI Direction

The final app will preserve the calm StreamList layout and styling. The EZTech catalog will be adapted into the existing page shell rather than bringing over the entire EZTech header and hero.

The Cart route will include:

- A short page header explaining subscriptions and accessories.
- A subscriptions section with the one-subscription warning near the subscription cards.
- An accessories section that allows repeated item additions.
- A cart review section with item images, quantity controls, line totals, remove buttons, and total price.
- Empty-cart messaging when no items are selected.

Cards will stay compact with modest border radii, responsive grids, and clear controls.

## Data Flow

The Cart page owns cart state through React `useState`.

On load, it reads persisted cart data from localStorage and validates that the stored value is an array. On cart changes, it writes the current cart back to localStorage. Button handlers call pure helper functions from `cartLogic.js`, then update React state with the returned cart.

Pure helpers will cover:

- `addItemToCart(cart, product)`
- `removeItemFromCart(cart, productId)`
- `updateCartQuantity(cart, productId, quantity)`
- `getCartItemCount(cart)`
- `calculateCartTotal(cart)`

## Error Handling

The app will keep storage failures non-fatal. If localStorage is unavailable, the Cart page will still work for the current session. Invalid stored cart data will fall back to an empty cart.

The subscription rule is a user-facing validation path rather than an error state. It will show a clear warning and preserve the existing cart.

## Testing

The final app will keep the current Node test runner rather than introducing Vitest during this merge. Cart logic tests will be ported from EZTech into `src/streamListUtils.test.mjs` so `npm test` continues to run one lightweight suite.

Required test coverage:

- Adding one subscription works.
- Adding a second subscription is blocked with the warning.
- Adding the same accessory increments quantity.
- Updating quantity changes totals.
- Setting quantity to zero removes an item.
- Removing an item removes only the matching product.
- Item count and total calculations are correct.

Verification commands:

- `npm test`
- `npm run build`

## Repository Plan

The final project will be initialized as its own Git repository in `Final Project`. Its remote will be the new GitHub repository:

`https://github.com/KRobertson-student/int499-final-streamlist.git`

The first final-project commit will include the copied base app plus the integrated cart feature and updated documentation.

## Out Of Scope

The final merge will not add payment processing, authentication, checkout submission, external inventory management, or account management. Those ideas belong to future project planning and are not needed to combine the current repositories into a working final application.
