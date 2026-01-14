import api from '../api/axiosInstance.js';

export const createReview = (payload) => api.post('/reviews', payload);

export const fetchReviews = (params) => api.get('/reviews', { params });

export const fetchReviewSummary = (supperCourtId) =>
  api.get(`/reviews/supper-courts/${supperCourtId}/summary`);

export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
