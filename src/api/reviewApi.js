import api from './axios';

// ✅ 전체 리뷰 목록 가져오기
export const fetchAllReviews = () => api.get('/api/reviews/all');

// ✅ 내 리뷰 보기
export const fetchMyReviews = () => api.get('/api/reviews/my');

// ✅ 리뷰 등록
export const submitReview = async (data) => {
  const res = await api.post('/api/reviews/submit', data);
  return res.data;
};

// ✅ 리뷰 수정
export const editReview = (id, data) => api.put(`/api/reviews/edit/${id}`, data);

// ✅ 리뷰 삭제
export const deleteReview = (id) => api.delete(`/api/reviews/delete/${id}`);

// 좋아요 누르기 (POST)
export const likeReview = (reviewId) => api.post(`/api/reviews/like/${reviewId}`);

// 좋아요 취소 (DELETE)
export const unlikeReview = (reviewId) => api.delete(`/api/reviews/like/${reviewId}`);