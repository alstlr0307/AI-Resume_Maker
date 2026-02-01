import React from 'react';
import styled from 'styled-components';

const ReviewTabs = ({ activeTab, setActiveTab }) => (
  <TitleContainer>
    <TitleWrapper>
      <TitleButton active={activeTab === 'popular'} onClick={() => setActiveTab('popular')}>인기 리뷰</TitleButton>
      <TitleButton active={activeTab === 'latest'} onClick={() => setActiveTab('latest')}>최신 리뷰</TitleButton>
      <TitleButton active={activeTab === 'myReviews'} onClick={() => setActiveTab('myReviews')}>내 리뷰</TitleButton>
    </TitleWrapper>
  </TitleContainer>
);

export default ReviewTabs;

const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TitleWrapper = styled.div`
  margin-top: 5rem;
  display: flex;
  margin-bottom: 1rem;
  transform: translateY(15px);
  margin-left: -37rem;
`;

const TitleButton = styled.button`
  background-color: ${(props) => (props.active ? "#eaf6fb" : "#64a8f0")};
  color: ${(props) => (props.active ? "#003049" : "#fff")};
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.6rem 1.4rem;
  border-radius: 16px 16px 0 0;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;
