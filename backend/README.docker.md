## Docker setup for Diaaru

This project includes Dockerfiles for the Strapi backend and the Vite frontend, plus a `docker-compose.yml` for local production-like runs.

Quick start (from project root):

```bash
# copy environment template and fill values
cp .env.example .env
# build and start services
docker compose up --build -d

# view logs
docker compose logs -f

# stop
docker compose down
```

Notes:
- The Compose file exposes Strapi on `localhost:1337` and the frontend on `localhost:3000`.
- Use `DATABASE_URL` in `.env` if you have a single connection string (e.g. Neon); Compose passes both individual `DATABASE_*` values and `DATABASE_URL` to Strapi.
- Uploaded files are persisted in the `strapi_uploads` volume.
- If you're deploying to a cloud provider, build images in CI and push to a registry rather than relying on Compose.

Troubleshooting:
- If frontend routes still 404 after deploying the frontend image, ensure the build produced `dist/index.html` and that the server serves the SPA (the provided Dockerfile.frontend uses nginx with the correct rewrite).
- Check service health with `docker compose ps` and `docker compose logs <service>`.
