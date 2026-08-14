// src/lib/formatters.js
export function formatDuration(seconds) {
    if (typeof seconds === 'number') seconds = parseFloat(String(seconds)).toFixed(2);
    const h = Math.floor((seconds / 60) / 60);
    const m = Math.round(((seconds / 60) % 60));
    let s = Math.round(seconds % 60);
    if (s < 10) s = String(s).padStart(2, '0');
    if (m >= 60) { h += Math.floor(m / 60); m %= 60; }
    return h > 0 ? `${h}h ${m}:${s}` : `${m}:${s}`;
}

export function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toISOString().split('.')[0].replace('T',' ') + `, ${d.getFullYear()}`;
      }
