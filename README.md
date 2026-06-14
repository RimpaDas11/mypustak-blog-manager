# 🚀 MyPustak Blog Post Manager

A full-stack blog management application built as part of the **MyPustak Full Stack Developer Hiring Challenge**.

## 📖 Overview

MyPustak Blog Post Manager is a modern web application that enables users to create, view, and delete blog posts through a clean and responsive interface. The project demonstrates full-stack development skills, API design, frontend-backend integration, and modern UI implementation.

---

## ✨ Features

### 📝 Create Posts

Add new blog posts with a title and content.

### 📚 View Posts

Display all available posts fetched from the backend API.

### 🗑️ Delete Posts

Remove posts instantly with a single click.

### ⚡ Fast & Responsive

Built with modern technologies for a smooth user experience.

### 🔄 Loading States

Provides visual feedback while fetching data.

### ⚠️ Error Handling

Handles API and network errors gracefully.

---

## 🛠️ Tech Stack

### Frontend

* HTML
* React.JS 
* JavaScript
* CSS 

### Backend

* FastAPI
* Pydantic
* Uvicorn

### Storage

* In-Memory Data Storage

---

## 📂 Project Structure

```text
mypustak-blog-manager/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── types/
│
└── README.md
```

---

## 🔗 API Endpoints

### Get All Posts

```http
GET /posts
```

### Create Post

```http
POST /posts
```

Example Request:

```json
{
  "title": "My First Post",
  "body": "This is my first blog post."
}
```

### Delete Post

```http
DELETE /posts/{id}
```

---

## ⚙️ Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 🎨 Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

## ✅ Assignment Requirements Covered

* FastAPI Backend
* Next.js Frontend
* GET /posts
* POST /posts
* DELETE /posts/{id}
* JSON Responses
* In-Memory Storage
* Loading States
* Error Handling
* Responsive UI

---

## 🚀 Future Enhancements

* Edit Posts
* Database Integration
* User Authentication
* Search & Filtering
* Pagination
* Cloud Deployment

---

## 👩‍💻 Developer

**Rimpa Das**

Aspiring Full Stack Developer passionate about building modern web applications and continuously learning new technologies.

---

## 🌟 MyPustak Blog Post Manager

### Full Stack Developer Hiring Challenge Submission

*Built with dedication, creativity, and a passion for software development.*

❤️ Developed by **Rimpa Das**
