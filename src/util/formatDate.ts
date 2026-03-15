export const formatEmailDate = (ms: number | Date): string => {
    const date = new Date(ms);
    const now = new Date();

    // Helper to check if two dates are the same calendar day
    const isSameDay = (d1: Date, d2: Date): boolean =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    // Check for Today
    if (isSameDay(date, now)) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).toLowerCase();
    }

    // Check for Yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (isSameDay(date, yesterday)) {
        return 'Yesterday';
    }

    // Check if same year
    const isSameYear = date.getFullYear() === now.getFullYear();

    if (isSameYear) {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
        });
    }

    // Fallback for older years
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};