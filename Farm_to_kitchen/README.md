# Project Title
Farm To Kitchen

## Introduction
Farm To Kitchen is a full-stack agricultural marketplace platform designed to bridge the gap between local farmers and consumers.
Consumers can shop for fresh farm produce directly from farmers, while farmers can manage their products, handle orders, and interact with customers.
Admins oversee all activities, ensuring a smooth, secure, and efficient platform.
The platform solves the inefficiencies and middlemen dependency in the farm-to-consumer supply chain.


## Project Type
Fullstack

## Deplolyed App
Frontend: https://stupendous-semifreddo-7d65ed.netlify.app/
Backend: https://farm-to-kitchen-backend.vercel.app/
Database: MongoDB Atlas (mongodb+srv://sadafara19:Cej90IldvRMs8y8y@farmtokitchen.a7njcwg.mongodb.net/)


## Directory Structure
farm-to-kitchen/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  └─ index.ts
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ .env
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ auth/
│  │  │  ├─ consumer/
│  │  │  ├─ farmer/
│  │  │  └─ admin/
│  │  ├─ components/
│  │  ├─ contexts/
│  │  ├─ hooks/
│  │  ├─ App.jsx
│  │  └─ index.jsx
│  ├─ tailwind.config.js
│  └─ package.json
└─ README.md


## Video Walkthrough of the project
(https://drive.google.com/drive/folders/13JoEjHZnjiaNAJ8xLlFlzCnbcqCAe-8e?usp=sharing)

## Video Walkthrough of the codebase
(https://drive.google.com/drive/folders/13JoEjHZnjiaNAJ8xLlFlzCnbcqCAe-8e?usp=sharing)

## Features

- Features
Role-based Authentication (Consumer, Farmer, Admin)
Product Management (Farmers can create, edit, delete products)
Shopping Cart (Consumers can add, remove, and update cart items)
Order Placement & Tracking (Checkout and track orders)
Admin Panel (Manage users, products, orders, and view analytics)
Weather & Crop Advisory (AI-based guidance for farmers)
Messaging system (Basic farmer-consumer messaging)
Responsive UI (Mobile-friendly and smooth UX)

- Design Decisions or Assumptions
Used Firebase Authentication for secure login and role handling.
Used MongoDB Atlas for a flexible, cloud-based database solution.
Orders are stored immediately once checkout succeeds; product stock 
- reduces at checkout.

Cart is tied to authenticated users for persistent state.
Error handling with user-friendly alerts and retry options.
Role access is strictly enforced at route level using middleware.


## Installation & Getting started

Backend Setup:

cd backend
npm install
npm run dev

Frontend Setup:

cd frontend
npm install
npm run dev

Environment Variables:
Create a .env file inside /backend/:

PORT=4000
MONGO_URI=mongodb+srv://sadafara19:Cej90IldvRMs8y8y@farmtokitchen.a7njcwg.mongodb.net/

FIREBASE_PROJECT_ID=1:302615184349:web:28145fbfb2d187eca2ac34

MongoDB:
Database: MongoDB Atlas
Main collections:
users
products
orders
carts

You can inspect collections easily using MongoDB Compass or Atlas UI.

## Usage
Typical User Flows:

# Consumer:
1. Sign Up / Log In as a consumer
2. Browse products
3. Add products to cart
4. Checkout and place an order
5. View order history

# Farmer:
1. Sign Up / Log In as a farmer
2. Add/Edit/Delete products
3. View incoming orders
4. Manage profile and messages

# Admin:
1. Log In as Admin
2. Manage users
3. Manage products
4. View platform analytics


## Credentials
use google authentication

## APIs Used
Firebase Admin SDK: Authentication & role validation
OpenWeather API (optional future feature): Weather for farmers
Internal Backend APIs: Product, Cart, Order management

## API Endpoints
Method	Endpoint	Description
GET	/api/products	Get all products
GET	/api/products/:id	Get single product
POST	/api/products	Create a new product (Farmer)
PATCH	/api/products/:id	Update a product (Farmer)
DELETE	/api/products/:id	Delete a product (Farmer)
GET	/api/cart	Get cart of authenticated user
POST	/api/cart	Add item to cart
PATCH	/api/cart/:productId	Update quantity in cart
DELETE	/api/cart/:productId	Remove item from cart
POST	/api/orders	Place new order
GET	/api/orders/mine	View consumer’s own orders
GET	/api/orders/farmer	View farmer’s incoming orders
PATCH	/api/orders/:id/status	Update order status




## Technology Stack
Frontend:
	•	React.js (with TailwindCSS)
	•	React Router
	•	Axios
	•	Backend:
	•	Node.js
	•	Express.js
	•	TypeScript
	•	Database:
	•	MongoDB Atlas (with Mongoose ODM)
	•	Authentication:
	•	Firebase Admin SDK
	•	Hosting/Deployment:
	•	Frontend: Vercel (or Netlify)
	•	Backend: Render / Railway / AWS EC2
	•	Other libraries/tools:
	•	JWT Authentication
	•	dotenv for environment management
	•	bcryptjs for secure password hashing (if needed later)
	•	react-icons for clean UI icons
	•	mongoose for modeling application data
