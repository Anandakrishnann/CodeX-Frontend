🎓 CodexLearning Frontend

The **CodexLearning Frontend** is a dynamic, full-featured React application for students, tutors, and admins.  
It provides intuitive course navigation, secure payments, real-time meetings, and a modern learning experience.

---

## 🌟 Key Features

### 👤 Users
- Register and login using **email or Google**.
- OTP-based signup verification.
- Browse and purchase courses.
- Track module progress and earn certificates.
- Join video sessions with tutors.

### 🎓 Tutors
- Apply via a **multi-step verification form**.
- Upload profile picture, document proof, and video introduction.
- Create and manage courses once verified.
- Schedule meetings with students.

### 💬 Collaboration
- Real-time chat and **ZegoCloud video call** integration.
- Join or host meetings directly from dashboard.
- Automated email reminders (handled by backend).

### 💳 Payment & Subscription
- **Stripe Checkout** integration for secure payments.
- Webhook-connected backend for subscription updates.
- Access management for premium content.

### 🧑‍💼 Admin
- Manage all users, tutors, and courses.
- Approve tutor applications.
- Monitor platform analytics and transactions.

---

## 🛠 Tech Stack

- **React (Vite)**
- **Redux Toolkit** + **Redux Persist**
- **TailwindCSS**
- **Axios**
- **Framer Motion**
- **React Toastify**
- **Stripe.js**
- **ZegoCloud SDK**

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/codexlearning-frontend.git
cd codexlearning-frontend
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Create Environment File
Create a .env file in your root folder:

ini
Copy code
REACT_APP_API_URL=http://127.0.0.1:8000/api/
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_ZEGO_APP_ID=your_zegocloud_app_id
REACT_APP_ZEGO_SERVER_SECRET=your_zegocloud_secret
4️⃣ Start Development Server
bash
Copy code
npm run dev
App runs on 👉 http://localhost:5173

📁 Folder Structure
pgsql
Copy code
Frontend/
└── CodeX/
    ├── src/
    │   ├── Admin/
    │   ├── Tutor/
    │   ├── User/
    │   ├── Component/
    │   ├── redux/
    │   ├── assets/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── .env
🔐 Security
Sanitized input fields prevent XSS or script injection.

JWT-based session management.

Role-aware protected routes for different dashboards.

🧑‍💻 Author
👨‍💻 Anandha Krishnan P S
B.Sc Electronics graduate → Self-taught Full-Stack Developer.
Passionate about scalable frontends, user-centric design, and building practical learning tools.

📫 Email: kanandha808@gmail.com
🔗 LinkedIn: linkedin.com/in/anandhakrishnnn

⭐ Show Your Support
If you like this project, give it a star ⭐ on GitHub — it motivates further innovation!
