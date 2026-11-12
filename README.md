# Karthi Clothing Co. – Website

## Status
- `client/` – **React + Tailwind frontend (current focus).** Runs standalone on sample data; enquiries are saved to browser localStorage.
- `server/` – Express + MongoDB backend (drafted early, **not wired up yet**; will be revisited later).

## Run the frontend
```bash
cd client
npm install
cp .env.example .env     # edit business name, phone, WhatsApp, email, address, map link, socials
npm run dev              # http://localhost:5173
npm run build            # production build in client/dist
```

## Configure business details
All contact details come from `client/.env` (`VITE_BUSINESS_*`). WhatsApp number: digits only with country code (e.g. `919876543210`). Restart `npm run dev` after editing.

## Where things are
- `src/lib/sampleData.js` – sample categories & products (placeholder garment art; swap for real photos). Set `showPrice: true` + `retailPrice`/`wholesalePrice` on a product to display prices.
- `src/lib/data.js` – single data-access layer; replace its functions with API calls when the backend is ready.
- `src/pages/` – Home, About, Products, ProductDetail, Wholesale, Contact.
- `src/components/` – layout, product cards, enquiry modal, shared UI.
