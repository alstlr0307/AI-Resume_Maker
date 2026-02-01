import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Card, ResumeImage, LikeButton, ReviewInfo } from './reviewStyles';

const ReviewCard = ({ image, title, content, liked, onToggleLike }) => (
  <Card>
    <ResumeImage src={image} />
    <LikeButton onClick={onToggleLike}>
      {liked ? <FaHeart style={{ color: '#e74c3c' }} /> : <FaRegHeart />}
    </LikeButton>
    <ReviewInfo>
      <div>{title}</div>
      <div>{content}</div>
    </ReviewInfo>
  </Card>
);

export default ReviewCard;
