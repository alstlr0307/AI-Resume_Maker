import React from 'react';
import styled from 'styled-components';
import ReviewCard from './ReviewCard';
import resumeImage from '../../assets/resume-1.jpg';

const ReviewGrid = ({ reviews, likedStates, onToggleLike }) => (
  <AllReviewsContainer>
    <VerticalSlider>
      <Grid>
        {reviews.map((review, i) => (
          <ReviewCard
            key={i}
            image={resumeImage}
            title={review.title}
            content={review.content}
            liked={likedStates[i]}
            onToggleLike={() => onToggleLike(i)}
          />
        ))}
      </Grid>
    </VerticalSlider>
  </AllReviewsContainer>
);

export default ReviewGrid;

const AllReviewsContainer = styled.div`
  background-color: #b6e4ff;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
  height: 630px;
`;

const VerticalSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 600px;
  overflow-y: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;
