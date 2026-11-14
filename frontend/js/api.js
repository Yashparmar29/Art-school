/**
 * API helper module.
 * Switch API_BASE_URL between local dev and deployed backend.
 */
export const API_BASE_URL = window.API_BASE_URL || (
  window.location.protocol === 'http:' || window.location.protocol === 'https:'
    ? (window.location.port === '5000'
        ? ''
        : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000'
            : 'https://create-art-school.onrender.com'))
    : 'http://localhost:5000'
);

/** Generic fetch wrapper with error handling */
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export async function getServices() { return apiFetch('/api/services'); }
export async function createBooking(data) { return apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) }); }
export async function getReviews() { return apiFetch('/api/reviews'); }
export async function createReview(data) { return apiFetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) }); }
export async function markReviewHelpful(reviewId) { return apiFetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' }); }
export async function sendContact(data) { return apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(data) }); }
export { API_BASE_URL };
