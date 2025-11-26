# 🧩 Foundy

**Foundy** is a lightweight, modern SaaS platform that brings all your website content - posts, pages, media, and product catalogs - together in one place.  
It’s built for both **creators** who just want to manage content easily, and **developers** who need API-level access to deliver that content anywhere.

> “One dashboard. Infinite front-ends.”

---

## 🚀 Overview

Foundy simplifies how you manage and deliver digital content.  
Whether you’re a freelancer, small business, or agency, Foundy lets you:

- 📚 Manage **blog posts**, **pages**, and **media** from one clean dashboard.  
- 🛍️ Handle **product catalogs** without the complexity of Shopify or WooCommerce.  
- 🔐 Provide **developer access** to your data via secure APIs and SDKs.  
- 🎨 White-label and brand your workspace for your agency or clients.  
- ☁️ Host content centrally while delivering it to **any frontend** - SvelteKit, Next.js, WordPress, or custom stacks/frameworks.

---

## ✨ Features

| Category | Features |
|-----------|-----------|
| 🖥️ **Dashboard** | Intuitive admin UI for content, products, and media |
| 🔑 **Access Control** | Role-based users (Owner, Editor, Viewer) |
| 📡 **API Delivery** | REST APIs for seamless integration |
| 🧱 **Developer Mode** | SDKs, webhooks, and schema extensions |
| 🏷️ **Tagging & SEO** | Built-in meta management and tagging |
| 🧰 **Multi-Tenant** | Manage multiple client sites from one account |
| 🎨 **White Label** | Agency branding and custom domains |
| 📊 **Analytics** | Content performance and usage insights |
---

## 🧑‍💻 Tech Stack

- **Frontend:** SvelteKit + Skeleton UI + Tailwind CSS + Lucide Icons
- **Backend:** Node.js / Edge functions / CRON Jobs
- **Database:** PostgreSQL (multi-tenant schema)  
- **Auth:** JWT with role-based permissions  
- **Integrations:** Stripe, Molly

---

## ⚙️ Getting Started

### ‼ Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL database connection

### 🧱 Installation
```bash
git clone https://github.com/jiridium/foundy.git
cd foundy
npm install
npm run dev || npx vite dev
