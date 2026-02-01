import styled from 'styled-components';
import { reviews as reviewList } from '../testUserProfile/reviews'; // ✅ 더미 데이터 불러오기
import profile1 from '../assets/profile1.jpg';
import profile2 from '../assets/profile2.jpg';
import profile3 from '../assets/profile3.jpg';

const BottomSection = styled.section`
  min-height: 70vh;
  padding: 10vh 5vw 4vh;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  margin-bottom: 30px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    margin: 10px auto 0;
    background-color: #88bff5;
    border-radius: 2px;
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(20px, 3vw, 40px);
  margin-top: 30px;
`;

const ReviewCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: clamp(1.5rem, 2.5vw, 2.4rem); // ✅ 내부 여유 있게
  width: clamp(260px, 28vw, 320px);
  min-height: 280px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);
  }
`;

/* ✅ 새로 추가 */
const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
`;

const ProfileImg = styled.img`
  width: 72px;  // ✅ 기존보다 약간 키움
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  text-align: left;
`;

const Nickname = styled.p`
  font-weight: 600;
  font-size: 1.1rem; // ✅ 살짝 키움
  color: #222;
  margin-bottom: 4px;
`;

const LikeCount = styled.p`
  color: #ff4d4f;
  font-size: 1rem;
  font-weight: bold;
`;

const ReviewTextBox = styled.p`
  background-color: #f1f4f8;
  border-radius: 12px;
  padding: 18px 20px;         // ✅ 여유 있게
  min-height: 80px;           // ✅ 너무 짧지 않게
  font-size: 1rem;            // ✅ 글씨도 보기 좋게
  line-height: 1.6;
  color: #333;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.04);
`;

function MainBottom({ language }) {
  const text = {
    ko: {
      title: '리뷰',
    },
    en: {
      title: 'Reviews',
    },
  };

  // ✅ 좋아요 많은 순으로 정렬 후 상위 3개 추출
  const topReviews = [...reviewList]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
    .map((review, index) => ({
      ...review,
      img: [profile1, profile2, profile3][index] || profile1, // ✅ 프로필 이미지 재사용
    }));

  return (
    <BottomSection>
      <SectionTitle>{text[language].title}</SectionTitle>
      <ReviewContainer>
        {topReviews.map((r, i) => (
          <ReviewCard key={r.id}>
            <TopRow>
              <ProfileImg src={r.img} alt="프로필" />
              <UserInfo>
                <Nickname>{r.nickname}</Nickname>
                <LikeCount>♥ {r.likes}</LikeCount>
              </UserInfo>
            </TopRow>
            <ReviewTextBox>{r.content}</ReviewTextBox>
          </ReviewCard>
        ))}
      </ReviewContainer>
    </BottomSection>
  );
}

export default MainBottom;
