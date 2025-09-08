# Hostel App (Docker: Node.js + MySQL + Static Frontend)

## Local Dev with Docker
```bash
docker compose up --build
```
- MySQL runs on port **3306** (password `example`, db `hostel_db`).
- Backend runs on **http://localhost:4000**.
- Serve `frontend/` locally (e.g., `python -m http.server 5500`).

## SQL schema
Run `sql/init.sql` in your MySQL (Docker DB already has `hostel_db`, but run it to ensure table exists).

## Deploy
- Provision MySQL (Railway or other). Import `sql/init.sql`.
- Deploy `backend/` (Render/Railway). Set these env vars:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `JWT_SECRET`, `JWT_EXPIRES_IN`
  - `PORT` (often provided automatically)
  - `CORS_ORIGIN` (your frontend URL)
- Host `frontend/` (Netlify/Render static). Update `frontend/config.js` production URL.

## Endpoints
- `POST /api/register`
- `POST /api/login`
- `GET /api/me` (requires `Authorization: Bearer <token>`)
