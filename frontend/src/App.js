import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API = 'http://localhost:8000';

// Floating orb particle that drifts across the screen
function FloatingOrb({ color, size, x, y, duration, delay }) {
  return (
    <div
      className="floating-orb"
      style={{
        '--orb-color': color,
        '--orb-size': size + 'px',
        '--orb-x': x + 'vw',
        '--orb-y': y + 'vh',
        '--orb-duration': duration + 's',
        '--orb-delay': delay + 's',
      }}
    />
  );
}

function FloatingWord({ word, x, y, duration, delay, opacity }) {
  return (
    <div
      className="floating-word"
      style={{
        '--fw-x': x + 'vw',
        '--fw-y': y + 'vh',
        '--fw-duration': duration + 's',
        '--fw-delay': delay + 's',
        '--fw-opacity': opacity,
      }}
    >
      {word}
    </div>
  );
}

function Background() {
  const orbs = [
    { color: 'rgba(124,106,255,0.35)', size: 400, x: 10, y: 15, duration: 18, delay: 0 },
    { color: 'rgba(255,106,158,0.25)', size: 300, x: 75, y: 60, duration: 22, delay: -5 },
    { color: 'rgba(79,255,176,0.2)', size: 250, x: 50, y: 30, duration: 26, delay: -10 },
    { color: 'rgba(124,106,255,0.2)', size: 180, x: 85, y: 10, duration: 20, delay: -3 },
    { color: 'rgba(255,106,158,0.15)', size: 350, x: 5, y: 70, duration: 30, delay: -8 },
  ];

  const words = [
    { word: 'write', x: 8, y: 20, duration: 25, delay: 0, opacity: 0.06 },
    { word: '{ post }', x: 60, y: 12, duration: 30, delay: -5, opacity: 0.05 },
    { word: 'publish', x: 80, y: 45, duration: 22, delay: -12, opacity: 0.07 },
    { word: 'story', x: 25, y: 75, duration: 28, delay: -8, opacity: 0.05 },
    { word: 'DELETE', x: 70, y: 80, duration: 20, delay: -3, opacity: 0.04 },
    { word: 'GET /posts', x: 40, y: 55, duration: 35, delay: -18, opacity: 0.04 },
    { word: 'ideas', x: 15, y: 45, duration: 24, delay: -6, opacity: 0.06 },
    { word: '201', x: 90, y: 25, duration: 19, delay: -9, opacity: 0.08 },
  ];

  return (
    <div className="bg-layer">
      {orbs.map((o, i) => <FloatingOrb key={i} {...o} />)}
      {words.map((w, i) => <FloatingWord key={i} {...w} />)}
      <div className="bg-grid" />
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast-icon">{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
}

function PostCard({ post, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    await onDelete(post.id);
  };

  const date = new Date(post.created_at * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <article className={`post-card ${deleting ? 'post-card--exiting' : ''}`}>
      <div className="post-card__accent" />
      <header className="post-card__header">
        <div className="post-card__meta">
          <span className="post-card__id">#{post.id.toString().padStart(3, '0')}</span>
          <span className="post-card__date">{date}</span>
        </div>
        <button
          className={`btn-delete ${confirm ? 'btn-delete--confirm' : ''}`}
          onClick={handleDelete}
          disabled={deleting}
          onBlur={() => setConfirm(false)}
          title={confirm ? 'Click again to confirm delete' : 'Delete post'}
        >
          {deleting ? (
            <span className="spinner-sm" />
          ) : confirm ? (
            <>⚠ Confirm</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
              Delete
            </>
          )}
        </button>
      </header>
      <h2 className="post-card__title">{post.title}</h2>
      <p className="post-card__body">{post.body}</p>
      <div className="post-card__footer">
        <span className="post-card__tag">post</span>
      </div>
    </article>
  );
}

function CreateForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const titleRef = useRef();

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title is required';
    else if (title.trim().length < 3) e.title = 'At least 3 characters';
    if (!body.trim()) e.body = 'Body is required';
    else if (body.trim().length < 10) e.body = 'At least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const ok = await onCreate({ title: title.trim(), body: body.trim() });
    setLoading(false);
    if (ok) { setTitle(''); setBody(''); titleRef.current?.focus(); }
  };

  return (
    <div className="create-form">
      <div className="create-form__header">
        <div className="create-form__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <div>
          <h3 className="create-form__title">New Post</h3>
          <p className="create-form__subtitle">Share your thoughts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={`field ${focused === 'title' ? 'field--focused' : ''} ${errors.title ? 'field--error' : ''}`}>
          <label className="field__label">Title</label>
          <input
            ref={titleRef}
            className="field__input"
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <div className="field__footer">
            {errors.title && <span className="field__error">{errors.title}</span>}
            <span className="field__count">{title.length}/120</span>
          </div>
        </div>

        <div className={`field ${focused === 'body' ? 'field--focused' : ''} ${errors.body ? 'field--error' : ''}`}>
          <label className="field__label">Body</label>
          <textarea
            className="field__input field__textarea"
            value={body}
            onChange={e => { setBody(e.target.value); setErrors(p => ({ ...p, body: '' })); }}
            onFocus={() => setFocused('body')}
            onBlur={() => setFocused(null)}
            placeholder="Write something meaningful..."
            maxLength={1000}
            rows={4}
          />
          <div className="field__footer">
            {errors.body && <span className="field__error">{errors.body}</span>}
            <span className="field__count">{body.length}/1000</span>
          </div>
        </div>

        <button className="btn-publish" type="submit" disabled={loading}>
          {loading ? (
            <><span className="spinner-sm" /> Publishing…</>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
              Publish Post
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <p className="empty-state__text">No posts yet</p>
      <p className="empty-state__sub">Write your first post using the form</p>
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API}/posts`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPosts(data.reverse());
    } catch (err) {
      setError('Could not load posts. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (post) => {
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!res.ok) {
        const err = await res.json();
        addToast(err.detail || 'Failed to create post', 'error');
        return false;
      }
      const newPost = await res.json();
      setPosts(p => [newPost, ...p]);
      addToast('Post published!', 'success');
      return true;
    } catch {
      addToast('Network error. Check backend.', 'error');
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/posts/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        addToast('Failed to delete post', 'error');
        return;
      }
      setPosts(p => p.filter(x => x.id !== id));
      addToast('Post deleted', 'success');
    } catch {
      addToast('Network error. Check backend.', 'error');
    }
  };

  return (
    <div className="app">
      <Background />

      <div className="toast-stack">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <header className="site-header">
        <div className="site-header__inner">
          <div className="logo">
            <span className="logo-mark">M</span>
            <span className="logo-text">MyPustak</span>
          </div>
          <nav className="header-nav">
            <span className="nav-badge">
              {loading ? '…' : posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
            <button className="btn-refresh" onClick={fetchPosts} title="Refresh">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </nav>
        </div>
      </header>

      <main className="main-layout">
        <aside className="sidebar">
          <CreateForm onCreate={handleCreate} />

          <div className="sidebar-info">
            <h4 className="sidebar-info__title">API Endpoints</h4>
            <ul className="endpoint-list">
              <li><span className="method method--get">GET</span><span>/posts</span></li>
              <li><span className="method method--post">POST</span><span>/posts</span></li>
              <li><span className="method method--del">DEL</span><span>/posts/:id</span></li>
            </ul>
          </div>
        </aside>

        <section className="feed">
          <div className="feed__header">
            <h1 className="feed__title">
              All Posts
              {!loading && <span className="feed__count">{posts.length}</span>}
            </h1>
          </div>

          {error && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
              <button className="error-banner__retry" onClick={fetchPosts}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : posts.length === 0 && !error ? (
            <EmptyState />
          ) : (
            <div className="posts-grid">
              {posts.map(p => (
                <PostCard key={p.id} post={p} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
