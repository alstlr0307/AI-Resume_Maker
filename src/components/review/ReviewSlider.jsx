import React from 'react';
import styled from 'styled-components';
import ReviewCard from './ReviewCard';
import resumeImage from '../../assets/resume-1.jpg';

const ReviewSlider = ({ reviews, likedStates, onToggleLike, offset, onPrev, onNext }) => {
  return (
    <BoxWrapper>
      <ArrowButton onClick={onPrev}>◀</ArrowButton>
      <SliderWrapper>
        <Slider offset={offset}>
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
        </Slider>
      </SliderWrapper>
      <ArrowButton onClick={onNext}>▶</ArrowButton>
    </BoxWrapper>
  );
};

export default ReviewSlider;

const BoxWrapper = styled.div`
  max-width: 1120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b6e4ff;
  border-radius: 16px;
  padding: 2rem;
  margin: 0 auto;
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const Slider = styled.div`
  display: flex;
  gap: 1.5rem;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => `-${props.offset}px`});
  width: fit-content;
`;
