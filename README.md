# 📚 Book Worm — React JS Capstone Project

> A full-featured, dark-themed e-bookstore Single Page Application (SPA) built with **React 18**, **TypeScript**, and **Tailwind CSS**.

---

## 🗂️ Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Application Flow](#-application-flow)
- [Pages & Components](#-pages--components)
- [State Management](#-state-management)
- [Styling System](#-styling-system)
- [Seed Data](#-seed-data)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [Coupon Code](#-coupon-code)
- [Responsive Design](#-responsive-design)
- [Folder Structure](#-folder-structure)

---

## 🌟 Project Overview

**Book Worm** is a responsive, dark-themed online bookstore built as a React JS capstone project. It simulates a real-world e-commerce experience for books — complete with user authentication, a rich product catalogue, shopping cart, address form, multiple payment methods, order management, wishlisting, and author-following features.

All data is managed entirely on the client side using React Context and `localStorage` — no backend or database is required.

---

## 🚀 Live Demo

Clone the repo, install dependencies, and run locally (see [Getting Started](#-getting-started)).

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router DOM | 6.20 | Client-side routing *(type definitions only — routing handled in-app)* |
| Create React App | 5 (react-scripts) | Build tooling |
| PostCSS + Autoprefixer | Latest | CSS processing |
| localStorage API | Browser native | User session & data persistence |

---

## 📁 Project Structure

```
bookworm/
├── public/
│   └── index.html              # App shell HTML
├── src/
│   ├── App.tsx                 # Root component + page router
│   ├── index.tsx               # React DOM entry point
│   ├── index.css               # Tailwind directives + base resets
│   ├── react-app-env.d.ts      # CRA type declarations
│   │
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces & types
│   │
│   ├── data/
│   │   ├── books.ts            # 15 seed books across 11 categories
│   │   └── users.ts            # 2 demo users + 3 seed orders
│   │
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication state & actions
│   │   ├── CartContext.tsx     # Shopping cart state & actions
│   │   └── OrderContext.tsx    # Order history state & actions
│   │
│   ├── components/
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── Sidebar.tsx         # Category filter sidebar
│   │   └── BookCard.tsx        # Reusable book tile card
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx       # Sign-in page
│   │   ├── RegisterPage.tsx    # Account creation page
│   │   ├── HomePage.tsx        # Browse & filter books
│   │   ├── BookDetailPage.tsx  # Book detail (3-column layout)
│   │   ├── CartPage.tsx        # Shopping cart + address form
│   │   ├── PaymentPage.tsx     # Payment modal + success screen
│   │   ├── OrdersPage.tsx      # Order history
│   │   ├── WishlistPage.tsx    # Saved books
│   │   └── MyWritersPage.tsx   # Followed authors
│   │
│   └── styles/
│       └── styles.css          # Global component styles + media queries
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

---

## ✨ Features

### 🔐 Authentication
- **Login** with email and password (persisted to `localStorage`)
- **Register** a new account with name, email, password, and confirmation
- Validation: minimum name length, password length, password match, duplicate email check
- Demo accounts pre-filled on the login screen for quick access
- Auto-login on page refresh via `localStorage` session

### 🏠 Home Page (Browse & Discover)
- **Recommended for You** — scored by purchased categories + featured flags
- **Bestsellers This Month** — curated bestseller list
- **New Launches** — recently added titles
- **Full filter bar:**
  - 🔍 Live search (title, author, tag)
  - 📂 Category sidebar (11 categories)
  - 🌍 Language filter (English, Hindi, Spanish, French, German)
  - 📖 Format filter (Paperback, Hardcover, eBook, Audiobook)
  - 💰 Price range filter (Under ₹200 / ₹400 / ₹600 / All)
  - 🔃 Sort (Relevance, Price Low→High, Price High→Low, Rating, Newest)

### 📖 Book Detail Page
- 3-column responsive layout: **Cover panel | Info panel | Related Reads**
- Front cover + back cover/preview panel with simulated barcode
- Author bio section
- ⭐ Star rating display and interactive review submission
- **Add to Cart** button (auto-navigates to cart after 600ms)
- **Add to Wishlist** / **Wishlisted** toggle
- Discount badge when `originalPrice` is present
- Book metadata strip: Language · Rating · Copies Sold
- **Related Reads** sidebar (same category books)

### 🛒 Shopping Cart
- Add, remove, and adjust quantity of cart items
- Book cover thumbnail rendered in CSS (no images needed)
- **Address form** with fields: First/Last Name, Address, Email, City, Pin, Phone (with country code), State, Country
- **Grand Total card** with:
  - Subtotal, 12% tax, free delivery
  - Coupon code field (`BOOKWORM` = ₹100 off)
  - Live grand total calculation
- Proceed to Payment button

### 💳 Payment Page
- Immersive dark background with CSS book illustrations
- **4 payment methods** via tab navigation:
  - 💳 Credit Card — card number (dash-formatted), name, CVV, expiry (MM/YYYY)
  - 💳 Debit Card — same fields
  - 📱 UPI — UPI ID input
  - 👜 Wallet — Paytm, PhonePe, Amazon Pay, Mobikwik
- **Processing animation** (1.2s simulated delay)
- **Success screen** — shows purchased books, animated green checkmark, "Continue Shopping" CTA

### 📦 Order History
- Filterd by logged-in user
- Order card with ID, date, status badge (Processing / Shipped / Delivered / Cancelled), and total
- Expand / collapse to see full item list and delivery address
- **Buy Again** — re-adds all items to cart in one click (2.5s confirmation state)

### 🤍 Wishlist
- Toggle wishlist from any BookCard or the Book Detail page
- Persisted to `localStorage` via `AuthContext`
- Grid view of all wishlisted books

### ✍️ My Writers
- Lists authors the user follows
- Each author section shows their full catalogue in the grid
- **Unfollow** button per author

---

## 🔄 Application Flow

```
App Start
    │
    ├─ Not authenticated ──► LoginPage / RegisterPage
    │
    └─ Authenticated
           │
           ├─ HomePage (default)
           │      ├─ Click book ──► BookDetailPage
           │      │                     ├─ Add to Cart ──► CartPage
           │      │                     └─ Wishlist toggle
           │      └─ Sidebar category filter
           │
           ├─ My Orders ──► OrdersPage
           ├─ My Wishlist ──► WishlistPage
           ├─ My Writers ──► MyWritersPage
           └─ Cart icon ──► CartPage
                                └─ Proceed ──► PaymentPage
                                                  └─ Pay Now ──► Success Screen ──► HomePage
```

---

## 📄 Pages & Components

### Pages

| Page | Route (in-app state) | Description |
|---|---|---|
| `LoginPage` | `authScreen = 'login'` | Email + password login, demo account shortcuts |
| `RegisterPage` | `authScreen = 'register'` | New account form with validation |
| `HomePage` | `activePage = 'home'` | Browse, filter, and discover books |
| `BookDetailPage` | `selectedBook !== null` | Full book details, reviews, related reads |
| `CartPage` | `activePage = 'cart'` | Cart items, address, grand total |
| `PaymentPage` | `activePage = 'payment'` | Payment method selection + success |
| `OrdersPage` | `activePage = 'orders'` | Purchase history |
| `WishlistPage` | `activePage = 'wishlist'` | Saved books |
| `MyWritersPage` | `activePage = 'writers'` | Followed authors + their books |

### Components

| Component | Props | Description |
|---|---|---|
| `Header` | `activePage`, `onNavigate`, `onToggleSidebar` | Top bar with logo, nav links, cart badge, profile dropdown |
| `Sidebar` | `active`, `onChange`, `isOpen`, `onClose` | Category filter; slides in as drawer on mobile |
| `BookCard` | `book`, `onOpen` | Book tile with cover, meta, price, wishlist button |

---

## 🧠 State Management

All state is managed with **React Context + Hooks** — no Redux or external state library.

### `AuthContext`
- Stores `currentUser` and `users[]` in `localStorage`
- Exposes: `login`, `register`, `logout`, `updateWishlist`, `followAuthor`, `isAuthenticated`

### `CartContext`
- In-memory cart state (reset on page reload by design)
- Exposes: `items`, `addToCart`, `removeFromCart`, `updateQty`, `clearCart`, `totalItems`, `totalPrice`

### `OrderContext`
- Hydrates seed orders with full `Book` objects from `books.ts`
- Exposes: `orders`, `placeOrder`

---

## 🎨 Styling System

The app uses a **hybrid CSS approach**:

- **Tailwind CSS** — utility classes for layout and spacing
- **`src/styles/styles.css`** — named component classes (BEM-inspired) with **CSS Custom Properties** as design tokens

### Design Tokens (CSS Variables)

```css
--bg-base:        #0d1117   /* Page background */
--bg-surface:     #161b27   /* Card / panel background */
--bg-raised:      #21262d   /* Elevated surface */
--text-primary:   #e6edf3   /* Headings, labels */
--text-muted:     #8b949e   /* Subtitles, metadata */
--accent:         #4f8ef7   /* Buttons, links, active states */
--success:        #2ea043   /* Delivered status, success CTA */
--danger:         #f85149   /* Error, discount badge */
--warning:        #f0a500   /* Processing status */
```

---

## 📦 Seed Data

### Books (`src/data/books.ts`)

15 books across **11 categories**: Self-help, Mystery, Romance, Science Fiction, Fantasy, Historical, Biography, Children's, Poetry, Science.

Each book has: `id`, `title`, `author`, `authorId`, `description`, `price`, `originalPrice?`, `format`, `category`, `tags`, `coverColor`, `coverTextColor`, `rating`, `reviewCount`, `inStock`, `deliveryDate`, `isbn`, `pages?`, `language`, plus optional flags: `isBestseller`, `isNewLaunch`, `isFeatured`.

### Users (`src/data/users.ts`)

| ID | Name | Email | Password |
|---|---|---|---|
| u1 | Soumik Das | soumik@bookworm.com | password123 |
| u2 | Priya Singh | priya@bookworm.com | priya2024 |

Pre-seeded with wishlisted books and followed authors.

### Orders

3 seed orders for user `u1`:
- `ord-001` — Delivered (2 items, ₹758)
- `ord-002` — Delivered (1 item, ₹299)
- `ord-003` — Shipped (2 items, ₹657)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# Clone the repository
git clone https://github.com/GitTBS9501/React_Js_Capstone_Project_bob.git
cd React_Js_Capstone_Project_bob

# Switch to the feature branch
git checkout bob_capstone

# Navigate into the app directory
cd bookworm

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at **http://localhost:3000**.

### Build for Production

```bash
npm run build
```

Output goes to `bookworm/build/`.

---

## 👤 Demo Accounts

| Email | Password | Pre-set Wishlist | Followed Authors |
|---|---|---|---|
| soumik@bookworm.com | password123 | The Midnight Hour, Cosmos Reborn | Arjun Patel, James Adams, Laura Mitchell |
| priya@bookworm.com | priya2024 | The Art of Learning, The Lost Kitten | Raj Patel, Emily Parker |

---

## 🎟️ Coupon Code

At checkout, enter the coupon code below in the cart:

```
BOOKWORM
```

This applies a **₹100 discount** to the grand total.

---

## 📱 Responsive Design

The app is fully responsive with three breakpoints:

| Breakpoint | Width | Changes |
|---|---|---|
| Desktop | > 1024px | Full 3-column detail layout, persistent sidebar |
| Tablet | ≤ 1024px | Stacked detail columns, hamburger sidebar trigger, stacked cart layout |
| Tablet (narrow) | ≤ 768px | Nav collapses into dropdown, single-column grids, stacked payment tabs |
| Mobile | ≤ 640px | Cart items stack vertically, detail CTA full-width, tighter padding throughout |

---

## 📝 Notes

- **No backend required** — all data lives in memory and `localStorage`
- **Book covers** are CSS-only (coloured divs with title/author text) — no image assets needed
- **Payment is simulated** — no real transactions are processed
- The `build/` folder and `node_modules/` are excluded from version control via `.gitignore`

---

*Built as a React JS Capstone Project — Book Worm © 2024*
