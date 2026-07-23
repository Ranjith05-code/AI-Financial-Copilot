const store = {};
const TTL = 30 * 1000; // 30 seconds

export const getCache = (key) => {
    const entry = store[key];
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL) {
        delete store[key];
        return null;
    }
    return entry.data;
};

export const setCache = (key, data) => {
    store[key] = { data, ts: Date.now() };
};

export const clearCache = (key) => {
    if (key) delete store[key];
    else Object.keys(store).forEach((k) => delete store[k]);
};
