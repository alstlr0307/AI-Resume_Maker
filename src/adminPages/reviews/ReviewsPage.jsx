import styled from 'styled-components';
import { useState } from 'react';
import { reviews as reviewList } from '../../testUserProfile/reviews';

const Wrapper = styled.div`
  padding: 40px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 260px;
  box-shadow: 1px 1px 4px rgba(0,0,0,0.05);
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ReviewCard = styled.div`
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

function ReviewsPage() {
  const [search, setSearch] = useState('');

  const filteredReviews = reviewList.filter(review =>
    review.nickname.toLowerCase().includes(search.toLowerCase()) ||
    review.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Wrapper>
      <TopBar>
        <Title>리뷰 관리</Title>
        <SearchInput
          type="text"
          placeholder="닉네임 또는 내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </TopBar>

      <ReviewList>
        {filteredReviews.map(review => (
          <ReviewCard key={review.id}>
            <div>
              <strong>{review.nickname}</strong> - 좋아요 ♥ {review.likes}
            </div>
            <div style={{ marginTop: '8px' }}>
              {review.content}
            </div>
          </ReviewCard>
        ))}
        {filteredReviews.length === 0 && <div>검색 결과가 없습니다.</div>}
      </ReviewList>
    </Wrapper>
  );
}

export default ReviewsPage;
