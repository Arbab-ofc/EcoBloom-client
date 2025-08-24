# 🌿 EcoBloom – MERN Plant E-Commerce Platform  

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)  
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)  
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)  
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)  
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue?logo=cloudinary)  
![Render](https://img.shields.io/badge/Backend-Render-purple?logo=render)  
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)  

**EcoBloom** is a full-stack e-commerce platform for buying plants online 🌱.  
Built with the **MERN stack**, it enables customers to browse and purchase plants, while providing an **admin dashboard** for plant & order management.  

✨ **Live Client:** [eco-bloom-client.vercel.app](https://eco-bloom-client.vercel.app)  
⚙️ **Live API:** [ecobloom-server.onrender.com](https://ecobloom-server.onrender.com)  

---

## 🌱 About EcoBloom  

EcoBloom simplifies the plant shopping experience while encouraging eco-friendly practices.  

- 🛒 **For Customers** – Browse by categories, search plants by ID/name, check availability, order, and track.  
- 🔑 **For Admins** – Manage plants, categories, and orders with a clean dashboard.  
- 📦 **Order Lifecycle** – Track both **delivery status** and **payment status**.  
- 📬 **Contact Us** – Reach the team directly from the site.  

> Project under **Urvann** 🌱 | Created by **Arbab Arshad** 💻  

---

## 🖥️ Tech Stack  

### **Frontend (Client)**
- ⚛️ React + Vite – Fast & modular UI.  
- 🎨 TailwindCSS – Clean responsive design.  
- 🚦 React Router – Navigation & protected routes.  
- 🔍 React Select – Multi-category selection.  
- 🍞 React Toastify – Notifications.  
- ⌨️ React Simple Typewriter – Hero animation.  

### **Backend (Server)**
- 🟢 Node.js + Express – REST API architecture.  
- 🍃 MongoDB + Mongoose – Database with indexing & schemas.  
- 🔑 JWT Auth – Secure cookie-based login.  
- 📧 Nodemailer – OTP verification & password reset.  
- ☁️ Cloudinary + Multer – Image uploads.  
- 🔒 CORS + Cookie Parser – Secure API calls.  

### **Deployment**
- 🌐 Vercel – Client hosting.  
- ⚙️ Render – API hosting.  
- ☁️ MongoDB Atlas – Cloud database.  
- 🖼️ Cloudinary – Image CDN.  

---

## ⚡ Features  

### 👥 Authentication  
- Registration with OTP email verification.  
- Login/Logout with JWT cookies.  
- Forgot/Reset password flow.  

### 🌿 Plant Catalog  
- Browse by category (Indoor, Outdoor, Medicinal, etc.).  
- Real-time search by name or plant ID.  
- Availability toggle.  

### 🛍️ Orders  
- Place orders with **address + payment method** (COD, UPI, Card, NetBanking).  
- Delivery tracking (`pending → confirmed → shipped → delivered → cancelled`).  
- Payment tracking (`pending / paid / failed`).  
- My Orders page with filters.  

### 🛠️ Admin Dashboard  
- CRUD for Plants.  
- Manage Orders with filters (status, payment, search by customer).  
- Total calculation for each order.  

### 📬 Contact Us  
- Submit queries via contact form.  
- Stored in DB with status tracking.  

---

## 📸 Screenshots  

### 🏠 Home Page  
![Home](/Users/arbabarshad/Desktop/EcoBloom/client/public/Home.png)
### 🔍 Plant Search  
![Search](/Users/arbabarshad/Desktop/EcoBloom/client/public/search.png)  

### 🛒 Plant Detail Page  
![Plant Detail](/Users/arbabarshad/Desktop/EcoBloom/client/public/plant-detail.png)  

### 📦 My Orders Page  
![My Orders](/Users/arbabarshad/Desktop/EcoBloom/client/public/my-order.png)  

### 🛠️ Admin Manage Orders  
![Admin Orders](/Users/arbabarshad/Desktop/EcoBloom/client/public/manage-order.png)  

### ➕ Add/Update Plant  
![Add Plant](/Users/arbabarshad/Desktop/EcoBloom/client/public/add-plant.png)  
![Update Plant](/Users/arbabarshad/Desktop/EcoBloom/client/public/update-plant.png)  

---

## 🚀 Getting Started  

### 1. Clone Repositories
```bash
# Client
git clone https://github.com/Arbab-ofc/EcoBloom-client.git
cd EcoBloom-client
npm install

# Server
git clone https://github.com/Arbab-ofc/EcoBloom-server.git
cd EcoBloom-server
npm install

```

## 2. Environment Variables

### Client (.env):
```
VITE_API_BASE=https://ecobloom-server.onrender.com/api

```
### Server (.env):

```

MAILUSER=
MAILPASS=
MAIL_FROM=
PORT=3000
MONGODB_URI=
FRONTEND_URL=https://eco-bloom-client.vercel.app
JWT_SECRET=
JWT_EXPIRES_IN=7d
COOKIE_NAME=token
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=
MONGO_URI=

```

## 3. Run Locally
```
# Client
npm run dev  # http://localhost:5173

# Server
npm run dev  # http://localhost:3000
```

## 🔗 API Overview

### -Users

POST /api/users/register

POST /api/users/login

POST /api/users/logout

POST /api/users/verify-otp

POST /api/users/forgot-password

POST /api/users/reset-password

### -Plants

GET /api/plants

GET /api/plants/:id

POST /api/plants (Admin)

PUT /api/plants/:id (Admin)

DELETE /api/plants/:id (Admin)

### -Orders

POST /api/orders

GET /api/orders/me

GET /api/orders/:id

GET /api/orders/admin/orders (Admin)

PATCH /api/orders/admin/orders/:id (Admin)

DELETE /api/orders/admin/orders/:id (Admin)

### -Contact

POST /api/contact

## ✨ Project Info

-- Project under Urvann 🌱

-- Created by Arbab Arshad 💻

-- Built with MERN, AWS, Cloudinary, Vercel, Render

-- Focused on clean, maintainable code

-- 🌿 “Grow green, live clean.”

## 🤝 Contribution

-- Contributions, issues, and feature requests are welcome!
-- Feel free to open a pull request or raise an issue.

### Steps to contribute:

-Fork the project

-Create a new branch (git checkout -b feature-name)

-Commit changes (git commit -m "Add some feature")

-Push to your branch (git push origin feature-name)

-Create a Pull Request

## 👨‍💻 Creator & Contact

***🌱 EcoBloom — A project under Urvann***
***Created with ❤️ by Arbab***

-- LinkedIn: https://www.linkedin.com/in/arbab-arshad-0b2961326/

-- Email: arbabprvt@gmail.com

## 📜 License & Copyright

© 2025 EcoBloom. All rights reserved.
This project is licensed under the MIT License — feel free to use and modify with attribution.


***Thanks***