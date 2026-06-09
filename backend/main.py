from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(title="MyPustak Blog API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
posts = [
    {"id": 1, "title": "Welcome to MyPustak", "body": "This is your first post. Start writing and sharing your thoughts with the world!", "created_at": 1700000000},
    {"id": 2, "title": "Getting Started with Blogging", "body": "Blogging is a great way to express yourself. Keep it simple, keep it honest, and write from the heart.", "created_at": 1700000100},
]
next_id = 3


class PostCreate(BaseModel):
    title: str
    body: str


class Post(BaseModel):
    id: int
    title: str
    body: str
    created_at: int


@app.get("/posts", response_model=List[Post])
def get_posts():
    return posts


@app.post("/posts", response_model=Post, status_code=201)
def create_post(post: PostCreate):
    global next_id
    if not post.title.strip():
        raise HTTPException(status_code=422, detail="Title cannot be empty")
    if not post.body.strip():
        raise HTTPException(status_code=422, detail="Body cannot be empty")
    new_post = {
        "id": next_id,
        "title": post.title.strip(),
        "body": post.body.strip(),
        "created_at": int(time.time()),
    }
    posts.append(new_post)
    next_id += 1
    return new_post


@app.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: int):
    global posts
    original_len = len(posts)
    posts = [p for p in posts if p["id"] != post_id]
    if len(posts) == original_len:
        raise HTTPException(status_code=404, detail="Post not found")
    return None
