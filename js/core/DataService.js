class DataService {
    constructor() {
        this.cache = new Map();
        this.basePath = './assets/data';
    }

    async load(filename) {
        if (this.cache.has(filename)) {
            return this.cache.get(filename);
        }

        try {
            const response = await fetch(`${this.basePath}/${filename}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.json`);
            }
            const data = await response.json();
            this.cache.set(filename, data);
            return data;
        } catch (error) {
            console.error(`Error loading data from ${filename}.json:`, error);
            return null;
        }
    }

    clearCache(filename = null) {
        if (filename) {
            this.cache.delete(filename);
        } else {
            this.cache.clear();
        }
    }

    async loadMultiple(filenames) {
        const results = {};
        const promises = filenames.map(async (filename) => {
            results[filename] = await this.load(filename);
        });
        await Promise.all(promises);
        return results;
    }
}

export const dataService = new DataService();

