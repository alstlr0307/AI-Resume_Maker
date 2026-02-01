import React from 'react';
import { FaStar } from 'react-icons/fa';
import { RatingBox, Label, Star } from './reviewWriteStyles';

const ReviewRating = ({ rating, setRating }) => (
  <RatingBox>
    <Label>별점</Label>
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        filled={index < rating}
        onClick={() => setRating(index + 1)}
      >
        <FaStar />
      </Star>
    ))}
  </RatingBox>
);

export default ReviewRating;
