# Points Counter

A minimal, mobile-friendly points counter web app built with Express, HTMX, and Tailwind CSS.

## Features
- RTL (Hebrew) support.
- Progress bar from 0 to 40 (red to green).
- Persistent storage using a JSON file.
- Mobile-first design.

## Deployment on Dokku

1. Create the app:
   ```bash
   dokku apps:create pointscounter
   ```

2. Create and mount a volume for data persistence:
   ```bash
   mkdir -p /var/lib/dokku/data/storage/pointscounter/data
   chown -R 32767:32767 /var/lib/dokku/data/storage/pointscounter/data
   dokku storage:mount pointscounter /var/lib/dokku/data/storage/pointscounter/data:/app/data
   ```

3. Deploy the app:
   ```bash
   git remote add dokku dokku@your-domain.com:pointscounter
   git push dokku main
   ```

## Development

```bash
npm install
npm run dev
```
