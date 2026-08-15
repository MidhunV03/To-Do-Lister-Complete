# 📝 To-Do Lister

A simple and interactive **Task Management Web Application** built using HTML, CSS, JavaScript, jQuery, Bootstrap, and JSON Server.

The application allows users to register, log in, and manage their personal tasks through a REST API.

## 🚀 Features

* 👤 User Registration & Login
* ➕ Create Tasks
* ✏️ Update Tasks
* 🗑️ Delete & Restore Tasks
* ✅ Task Status Management
* ⭐ Task Priority Management
* ⏰ Overdue Task Detection
* 📅 Date-Based Task Filtering
* 🌙 Dark Mode
* 👤 User Profile
* 🔔 Interactive Notifications
* 📱 Responsive Design
* 💾 User-specific task management

## 🛠️ Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript
* jQuery
* Bootstrap 5

**Backend / API**

* JSON Server
* REST API

**Libraries**

* SweetAlert2
* Toastr
* Font Awesome
* Bootstrap Icons

## 📂 Project Structure

```text
To-do-Lister/
│
├── asserts/
├── pages/
│   ├── Home.html
│   ├── Main.html
│   └── userProfile.html
│
├── script/
│   ├── Home.js
│   ├── Main.js
│   └── userProfile.js
│
├── styles/
│   └── Home.css
│
├── db.json
├── package.json
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd To-do-Lister
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start JSON Server

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

### 4. Run the Frontend

Open `pages/Home.html` using **Live Server** or another local development server.

## 🔄 CRUD Operations

The application communicates with JSON Server using REST APIs:

```text
GET     → Read users/tasks
POST    → Create users/tasks
PATCH   → Update tasks/users
```

Tasks are associated with the currently logged-in user, allowing each user to manage their own tasks.

## 🔐 Note

This project is built for **learning and portfolio purposes**. Authentication is currently client-side and JSON Server is used as the backend API. It is not intended to provide production-level security.

## 🔮 Future Improvements

* Express.js backend
* Real database integration
* Secure authentication
* Password hashing
* JWT/session-based authentication
* Task search and categories
* Task reminders and notifications

## 👨‍💻 Author

**Midhun V**

Built as a learning project to practice **JavaScript, REST APIs, CRUD operations, DOM manipulation, and responsive web development**.

---

⭐ If you found this project useful, consider giving the repository a star!
