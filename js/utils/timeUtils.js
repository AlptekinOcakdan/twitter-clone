const TURKISH_MONTHS = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
];

export function formatRelativeTime(isoTimestamp) {
    if (!isoTimestamp) return '';

    try {
        const now = new Date();
        const timestamp = new Date(isoTimestamp);

        if (isNaN(timestamp.getTime())) {
            console.warn('Invalid timestamp:', isoTimestamp);
            return isoTimestamp;
        }

        const diffMs = now - timestamp;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffSeconds < 5) {
            return 'şimdi';
        }

        if (diffSeconds < 60) {
            return `${diffSeconds}s`;
        }

        if (diffMinutes < 60) {
            return `${diffMinutes}dk`;
        }

        if (diffHours < 24) {
            return `${diffHours}s`;
        }

        if (diffDays < 7) {
            return `${diffDays}g`;
        }

        if (diffWeeks < 4) {
            return `${diffWeeks}h`;
        }

        const currentYear = now.getFullYear();
        const timestampYear = timestamp.getFullYear();

        if (currentYear === timestampYear) {
            const day = timestamp.getDate();
            const month = TURKISH_MONTHS[timestamp.getMonth()];
            return `${day} ${month}`;
        }

        const day = timestamp.getDate();
        const month = TURKISH_MONTHS[timestamp.getMonth()];
        const year = timestamp.getFullYear();
        return `${day} ${month} ${year}`;

    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return isoTimestamp;
    }
}

export function getCurrentTimestamp() {
    return new Date().toISOString();
}
