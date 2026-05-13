# EDIMS — Project Report (Architecture, Functionality & Onboarding)

This document describes the **MU-Project-1** workspace: the **EDIMS** (inventory / paper-sales style) system split into a **React** client and a **Node.js + Express + Sequelize + MySQL** backend. It is intended for developers joining the project later.

---

## 1. Executive summary

| Layer | Technology | Role |
|--------|------------|------|
| Frontend | React 19, React Router 7, Tailwind, Axios, js-cookie | SPA on port **3000** (default) |
| Backend | Express 5, Sequelize 6, mysql2, JWT, bcryptjs, nodemailer | REST API on port **5000** (default) |
| Database | MySQL (e.g. XAMPP) | Persistent data; schema evolved via **Sequelize `sync({ alter: true })`** |

**Typical local URLs**

- Client: `http://localhost:3000`
- API: `http://localhost:5000`
- API base path: `/api/...`

---

## 2. Repository layout

```
MU-Project-1/
├── client/                 # React (Create React App style)
│   ├── public/
│   ├── src/
│   │   ├── App.js          # Routes: login, forgot/reset password, /dashboard
│   │   ├── Components/     # Login, Navbar, Sidebar, PageManager, ProtectedRoute, …
│   │   ├── pages/          # Feature screens (masters, entries, ledgers, audit)
│   │   └── utils/          # axiosConfig, dateInputHelpers, …
│   ├── .env                # Optional: REACT_APP_API_URL (defaults exist in code)
│   └── env-template.txt
│
├── edims-backend/          # Node API
│   ├── src/
│   │   ├── server.js       # Entry: loadEnv → connect DB → listen
│   │   ├── loadEnv.js      # dotenv MUST load before app/db (ESM import order)
│   │   ├── app.js          # Express app, CORS, routes, connectToDatabase
│   │   ├── config/db.js    # Sequelize instance
│   │   ├── models/         # Sequelize models + associations (index.js)
│   │   ├── controllers/    # Business logic per domain
│   │   ├── routes/         # HTTP route wiring + middleware
│   │   ├── middleware/     # JWT protect, isAdmin
│   │   └── utils/          # emailService, auditLog.util, …
│   ├── .env
│   ├── env-template.txt    # Note: resolve git merge markers if present
│   ├── insert_default_users.sql
│   └── README_DEFAULT_USERS.md
│
└── EDIMS_PROJECT_REPORT.md # This file
```

---

## 3. How to run locally

### 3.1 Database

1. Start **MySQL** (e.g. XAMPP).
2. Create database **`edims_db`** (or match `DB_NAME` in backend `.env`).
3. Optionally seed users: run `edims-backend/insert_default_users.sql` (see `README_DEFAULT_USERS.md`).

### 3.2 Backend

```bash
cd edims-backend
# Copy env-template to .env and set DB_*, JWT_SECRET, CLIENT_URL, SMTP_* as needed
node src/server.js
```

**Important:** Use `node src/server.js` (or fix `package.json` `"start"` script to point at `src/server.js`). The server loads `./loadEnv.js` first so `process.env` is populated before any model imports.

### 3.3 Frontend

```bash
cd client
# Optional: client/.env with REACT_APP_API_URL=http://localhost:5000
npm start
```

Axios shared instance: `client/src/utils/axiosConfig.js` — **`baseURL`** defaults to `http://localhost:5000` if `REACT_APP_API_URL` is unset (aligned with `Login.js` / `ForgotPassword.js` / `ResetPassword.js`).

---

## 4. Authentication & security

### 4.1 JWT (`edims-backend/src/middleware/auth.middleware.js`)

- Reads `Authorization: Bearer <token>`.
- Verifies with `JWT_SECRET`.
- **Inactivity:** compares `lastActivity` in payload to `INACTIVITY_LIMIT` (20 minutes); may respond **440** with session-expired message.
- **Rolling session:** issues refreshed token in header **`x-refreshed-token`**; client interceptor in `axiosConfig.js` saves it to cookie.

### 4.2 Roles

- **`Admin`** — full access; e.g. user list, audit logs, vendor/item/department mutations, bill completion.
- **`Staff`** — operational access where routes use `protect` without `isAdmin`.

`isAdmin` checks `req.user.role === 'Admin'` (exact string; must match DB ENUM).

### 4.3 Client token storage

- **Cookie:** `authToken` (used by Axios interceptor).
- **Session storage:** `user`, `role` for UI.

### 4.4 Passwords (`edims-backend/src/models/user.model.js`)

- **`password_hash`** stored as **bcrypt** hash.
- **`beforeCreate` / `beforeUpdate`:** hash plaintext; **skip** if value already looks like a bcrypt hash (`$2a$` / `$2b$` / `$2y$`) to avoid double-hashing.
- **`resetPassword`:** must assign **plaintext** new password to `user.password_hash` and `save()` — hooks perform a single hash.

---

## 5. Backend API map

All JSON APIs live under `/api` unless noted.

| Mount path | File | Notes |
|------------|------|--------|
| `/api/auth` | `routes/auth.routes.js` | Register, login, forgot/reset password; `GET /users` admin-only |
| `/api/vendors` | `routes/vendor.routes.js` | Some GET/POST routes historically without `protect` (dev); PUT/DELETE admin |
| `/api/items` | `routes/item.routes.js` | Same pattern as vendors |
| `/api/departments` | `routes/department.routes.js` | Same pattern |
| `/api/purchase-orders` | `routes/purchaseOrder.routes.js` | All `protect` |
| `/api/challans` | `routes/challan.routes.js` | Router-level `protect` |
| `/api/bills` | `routes/bill.routes.js` | Create/read; complete = admin; delete pending bill |
| `/api/stock-issues` | `routes/stockIssue.routes.js` | `protect` |
| `/api/reports` | `routes/report.routes.js` | `protect` — stock, ledgers, summaries |
| `/api/audit-logs` | `routes/auditLog.routes.js` | `protect` + **`isAdmin`** |

**Health / test**

- `GET /` — welcome JSON.
- Test routes may exist under `/api/test-*` (see `app.js`).

---

## 6. Domain functionality (business flow)

### 6.1 Masters

- **Users** — `UserManagement` uses `POST /api/auth/register` and `GET /api/auth/users` (admin).
- **Vendors, Items, Departments** — CRUD via respective controllers; unique constraints on names/GST/item tuple where defined in models.

### 6.2 Purchase → Challan → Bill (core inventory chain)

1. **Purchase order (PO)** — Header + line items (`PurchaseOrder`, `PurchaseOrderItem`). Status: `Pending Delivery` | `Completed`.
2. **Challan (goods receipt)** — Linked to PO; `ChallanItem` lines; updates **`quantity_received`** on PO lines and **`Item.current_stock`**; may set PO to **Completed** when all lines fully received.
3. **Bill** — Links one vendor to multiple **unlinked** challans (`BillChallan`); line amounts on `BillItem`. Create path recomputes quantities from challans for tamper resistance. Status **Pending** | **Completed**; admin **completes** bill.

### 6.3 Stock issue

- **`StockIssue`** — Reduces `Item.current_stock`; links item, department, issuer (`user_id`), purpose, issue date.

### 6.4 Reports (`report.controller.js`)

- Stock listing, item ledger, vendor ledger, bill summary (see `report.routes.js`).

### 6.5 Audit trail

- Helper: `edims-backend/src/utils/auditLog.util.js` — **`recordAudit`**, **`actorUserId`** (uses `req.user` or optional Bearer decode when `protect` is missing on POST).
- Writes on: auth events (login, register, password reset email/success), PO/challan/bill/stock issue creates, bill complete/delete, vendor/item/department CRUD.
- **Read:** `GET /api/audit-logs` (admin only), includes `User` for actor display.

### 6.6 Email

- Password reset uses **`emailService.js`** + SMTP variables in backend `.env`.

---

## 7. Database structure (logical / Sequelize)

MySQL database name is typically **`edims_db`**. Physical columns include Sequelize defaults (**`createdAt`**) where `timestamps: true` and FK columns added by associations (e.g. `user_id`, `vendor_id`, `po_id`).

### 7.1 Tables (model `tableName`)

| Table | Primary key | Main fields / notes |
|--------|----------------|---------------------|
| **Users** | `user_id` | `username`, `password_hash`, `full_name`, `role` (ENUM Admin/Staff), `email`, `last_login`, `reset_token`, `reset_token_expiry`, `createdAt` |
| **Vendors** | `vendor_id` | `vendor_name`, `gst_no`, contact fields, `createdAt` |
| **Items** | `item_id` | `item_name`, `size`, `color`, `current_stock`; unique on (`item_name`,`size`,`color`) |
| **Departments** | `dept_id` | `dept_name`, `createdAt` |
| **PurchaseOrders** | `po_id` | `purchase_no`, `status`, `order_date`, `remarks`, FKs `vendor_id`, `user_id`, `createdAt` |
| **PurchaseOrderItems** | `po_item_id` | `quantity_ordered`, `quantity_received`, FKs `po_id`, `item_id` |
| **Challans** | `challan_id` | `challan_no`, `delivery_date`, FKs `po_id`, `user_id`, `createdAt` |
| **ChallanItems** | `challan_item_id` | `quantity_received`, FKs `challan_id`, `item_id` |
| **Bills** | `bill_id` | `bill_no`, `bill_date`, `bill_amount`, `status`, FKs `vendor_id`, `user_id`, `createdAt` |
| **BillChallans** | `bill_challan_id` | Junction: `bill_id`, `challan_id` |
| **BillItems** | `bill_item_id` | `quantity`, `rate`, FKs `bill_id`, `item_id` |
| **StockIssues** | `issue_id` | `quantity_issued`, `purpose`, `issue_date`, FKs `item_id`, `dept_id`, `user_id`, `createdAt` |
| **AuditLog** | `log_id` | `action_type`, `module`, `record_id`, `user_id`, `details` (JSON), `createdAt` |

**Associations** are centralized in `edims-backend/src/models/index.js` (hasMany / belongsTo / belongsToMany). Any new model should be registered there.

### 7.2 Schema changes

On startup, `connectToDatabase` runs **`sequelize.sync({ alter: true })`**, which can **ALTER** tables to match models. Use caution in production; prefer migrations for production-grade workflows.

---

## 8. Frontend structure

### 8.1 Routing (`App.js`)

- Public: `/login`, `/forgot-password`, `/reset-password`
- Protected shell: `/dashboard` → **`PageManager`** inside **`ProtectedRoute`**

### 8.2 Main shell (`PageManager.js` + `Sidebar.js`)

- **State-driven “pages”** (not separate URL segments): `page` string switches between Dashboard, masters, entries, ledgers, Audit Log.
- Match **exact** strings used in `Sidebar` (e.g. `"Purchase Entry"` with space).

### 8.3 API usage

- Prefer **`import api from "../utils/axiosConfig"`** for authenticated calls (token + refresh handling).
- **Login / Forgot / Reset** use raw `axios` + explicit base URL pattern consistent with env fallbacks.

### 8.4 Date inputs (entry forms)

- `client/src/utils/dateInputHelpers.js` — local `YYYY-MM-DD`, **`min`** = today for Purchase/Challan/Bill/Issue entry modals.

---

## 9. Environment variables

### 9.1 Backend (`edims-backend/.env`)

| Variable | Purpose |
|----------|---------|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` | MySQL connection |
| `PORT` | HTTP port (default 5000) |
| `CLIENT_URL` | CORS origin (e.g. `http://localhost:3000`) |
| `JWT_SECRET` | Signing JWTs |
| `SMTP_*`, `SMTP_FROM` | Nodemailer for password reset |

### 9.2 Client (`client/.env`)

| Variable | Purpose |
|----------|---------|
| `REACT_APP_API_URL` | API base URL; if omitted, code defaults to `http://localhost:5000` in `axiosConfig` and auth screens |

---

## 10. Known quirks & tips for maintainers

1. **ESM + dotenv:** `loadEnv.js` is imported **first** in `server.js` so `db.js` and models see env vars. Do not import `app.js` before env is loaded in new entrypoints.
2. **`npm start` in backend `package.json`** points at `server.js` (root), which may not exist — use **`node src/server.js`** or fix the script.
3. **Route auth inconsistency:** some vendor/item/department **POST** routes may omit `protect`; audit helper **`actorUserId`** tries JWT from headers when `req.user` is missing.
4. **`edims-backend/env-template.txt`** may contain unresolved git merge markers — clean before copying to `.env`.
5. **Role casing:** must match `'Admin'` for admin checks.
6. After **password reset**, users affected by an old double-hash bug must reset once more after the hook fix (see section 4.4).

---

## 11. Suggested next steps for new contributors

1. Run backend + client locally; log in as seeded admin/staff.
2. Trace one full flow: **PO → Challan → Bill → Complete bill**, watch DB tables and **AuditLog**.
3. Read **`bill.controller.js`** for transaction + security pattern used on bill create.
4. When adding features: add route → controller → (model if needed) → register model in **`models/index.js`** → optional **`recordAudit`** for mutations.

---

## 12. Document metadata

- **Project name (UI):** EDIMS (inventory / paper sales context in client copy).
- **Report generated for:** repository `MU-Project-1` (structure and behavior as of the date this file was added).
- **Maintainers:** update this file when you add major modules, env vars, or deployment steps.

---

*End of report.*
