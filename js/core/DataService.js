const STORAGE_PREFIX = 'twitter-clone-';

class DataService {
    constructor() {
        this.cache = new Map();
        this.basePath = './assets/data';
    }

    async load(filename) {
        if (this.cache.has(filename)) {
            return this.cache.get(filename);
        }

        const storageKey = STORAGE_PREFIX + filename;
        const cached = localStorage.getItem(storageKey);

        if (cached) {
            try {
                const data = JSON.parse(cached);
                this.cache.set(filename, data);
                console.log(`Loaded ${filename} from localStorage`);
                return data;
            } catch (e) {
                console.warn(`Invalid localStorage data for ${filename}, falling back to JSON file`);
            }
        }

        try {
            const response = await fetch(`${this.basePath}/${filename}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.json`);
            }
            const data = await response.json();
            this.cache.set(filename, data);
            console.log(`Loaded ${filename} from JSON file`);
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

    save(filename, data) {
        const storageKey = STORAGE_PREFIX + filename;
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            this.cache.set(filename, data);
            console.log(`Saved ${filename} to localStorage`);
            return true;
        } catch (e) {
            console.error(`Failed to save to localStorage: ${filename}`, e);
            return false;
        }
    }

    clearStorage(filename = null) {
        if (filename) {
            localStorage.removeItem(STORAGE_PREFIX + filename);
            this.cache.delete(filename);
        } else {
            Object.keys(localStorage)
                .filter(key => key.startsWith(STORAGE_PREFIX))
                .forEach(key => localStorage.removeItem(key));
            this.cache.clear();
        }
    }
}

export const dataService = new DataService();

