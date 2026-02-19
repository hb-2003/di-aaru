## Docker setup for Diaaru backend

This setup runs only the Strapi backend and Postgres via `docker-compose.yml`.

Quick start (from project root):

```bash
# copy and fill backend env
cp backend/.env.example backend/.env

# build and start backend stack (postgres + strapi)
docker compose up --build -d

# view logs
docker compose logs -f strapi

# stop
docker compose down
```

Notes:
- Strapi is exposed at `http://localhost:1337`.
- Admin panel is at `http://localhost:1337/admin`.
- Use `DATABASE_URL` in `backend/.env` if you use a managed DB (for example Neon).
- Uploaded files are persisted in `strapi_uploads`.

Troubleshooting:
- Check service health with `docker compose ps`.
- Inspect logs with `docker compose logs postgres` and `docker compose logs strapi`.
