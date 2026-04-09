import fs from 'fs';
import path from 'path';

export class PointsManager {
    private points: number = 0;
    private readonly filePath: string;
    private flushInterval: NodeJS.Timeout | null = null;

    constructor(dataDir: string) {
        this.filePath = path.join(dataDir, 'points.json');
        this.load();
        this.startFlushing();
    }

    private load() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                const json = JSON.parse(data);
                this.points = json.points || 0;
            } else {
                this.save();
            }
        } catch (error) {
            console.error('Error loading points:', error);
            this.points = 0;
        }
    }

    private save() {
        try {
            const data = JSON.stringify({ points: this.points });
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.filePath, data, 'utf-8');
        } catch (error) {
            console.error('Error saving points:', error);
        }
    }

    public getPoints(): number {
        return this.points;
    }

    public increment(): number {
        this.points++;
        return this.points;
    }

    public decrement(): number {
        this.points--;
        return this.points;
    }

    private startFlushing() {
        this.flushInterval = setInterval(() => {
            this.save();
        }, 60000); // Flush every minute
    }

    public stop() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
        this.save();
    }
}
