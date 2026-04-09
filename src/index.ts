import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PointsManager } from './pointsManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, '..', 'data');
const pointsManager = new PointsManager(dataDir);

// Hardcoded settings
const HEADER = "נקודות טואלט";
const TARGET = 40;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware to calculate view data
const getViewData = () => {
    const points = pointsManager.getPoints();
    const progress = Math.min(Math.max((points / TARGET) * 100, 0), 100);
    // Calculate hue from red (0) to green (120)
    const hue = Math.min(Math.max((points / TARGET) * 120, 0), 120);
    return {
        points,
        target: TARGET,
        header: HEADER,
        progress,
        hue
    };
};

app.get('/', (req, res) => {
    res.render('index', getViewData());
});

app.post('/increment', (req, res) => {
    pointsManager.increment();
    res.render('partials/counter', getViewData());
});

app.post('/decrement', (req, res) => {
    pointsManager.decrement();
    res.render('partials/counter', getViewData());
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    pointsManager.stop();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    pointsManager.stop();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
