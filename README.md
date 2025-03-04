# BastBranded Residences - Monorepo

This is a **Next.js monorepo** using **TurboRepo**, containing the **web** and **admin** applications for **BastBranded Residences**.

## 📂 Project Structure

```
bbr-fe/                # Root monorepo directory
│── apps/              # Applications
│   ├── web/           # Web application (Next.js + SCSS)
│   ├── admin/         # Admin panel (Next.js + ShadCN UI)
│── packages/          # Shared packages (if needed in the future)
│── node_modules/      # PNPM dependencies
│── .turbo/            # TurboRepo cache
│── pnpm-workspace.yaml # PNPM Workspaces configuration
│── turbo.json         # TurboRepo configuration
│── package.json       # Root package.json for the monorepo
│── README.md          # Documentation
```

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies
Since we use **PNPM**, install all dependencies from the root directory:

```sh
pnpm install
```

---

### 2️⃣ Running the Applications
#### Run **web** and **admin** applications simultaneously:
```sh
pnpm turbo run dev --parallel
```
🔹 **Web** application → `http://localhost:3000`  
🔹 **Admin** application → `http://localhost:3001`  

#### Run only the web application
```sh
pnpm run dev --filter=web
```

#### Run only the admin application
```sh
pnpm run dev --filter=admin
```

---

## ⚙️ Configuration
- **Monorepo powered by [TurboRepo](https://turbo.build/)**
- **Frontend uses Next.js (App Router)**
- **Admin panel is built with [ShadCN UI](https://ui.shadcn.com/)**
- **PNPM is the package manager**
- **TailwindCSS is configured for both applications**
- **SCSS is used for the web application**
- **Admin panel is permanently in dark mode**

---

## 🔗 Deployment
Deployment is **not yet set up**, but it will likely be done using **Vercel** or **Docker** in the future.

---

## 📌 Additional Information
📌 **Contact the team for API documentation and `.env` configuration.**  
📌 **Use a feature branch strategy (`feature/feature-name`) when working on new features.**  
📌 **Follow best practices and coding standards for Next.js and TurboRepo.**  

---

💡 **This `README.md` provides clear guidance for new developers joining the project.**  
🚀 **Let me know if you need any modifications!** 😊