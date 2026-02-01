import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  width: 200px;
  min-height: 280px;
  border: 1.5px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ResumeImage = styled.img`
  width: 100%;
  height: 270px;
  object-fit: contain;
`;

export const LikeButton = styled.button`
  margin-top: 0.5rem;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  align-self: flex-start;
  font-size: 1.2rem;
`;

export const ReviewInfo = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  text-align: left;
  word-break: keep-all;
  width: 100%;
  max-width: 180px;
`;
