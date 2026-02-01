// src/pages/MyPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import profileImg from "../assets/profile1.jpg";
import resume1 from "../assets/이력서이미지.jpg";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from '../contexts/AuthContext';

const MyPage = ({ language = "ko", onChangeLanguage }) => {
  const [tab, setTab] = useState("review");
  const [resumeItems, setResumeItems] = useState([]);
  const [reviewItems, setReviewItems] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsRes = await api.get("/api/reviews/my");
        setReviewItems(reviewsRes.data);
      } catch (err) {
        console.error("리뷰 로딩 오류:", err);
      }

      try {
        const resumesRes = await api.get("/api/resumes");
        setResumeItems(resumesRes.data);
      } catch (err) {
        console.warn("이력서 로딩 실패:", err);
      }
    };

    fetchData();
  }, []);

  const t = {
    ko: {
      title: "마이페이지",
      profileName:  user?.username || "사용자",
      info: "개인정보 🔗",
      blog: "블로그 🔗",
      resume: "이력서",
      review: "리뷰",
      more: "더 보기",
    },
    en: {
      title: "My Page",
      profileName: user?.username || "User",
      info: "Profile Info 🔗",
      blog: "Blog 🔗",
      resume: "Resume",
      review: "Review",
      more: "Load more",
    },
  }[language];

  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <Content>
        <Title>{t.title}</Title>

        <ProfileSection>
          <ProfileImage src={profileImg} alt="프로필" />
          <div>
            <ProfileText>{t.profileName}</ProfileText>
            <LinkText onClick={() => navigate("/ProfilePage")}>
              {t.info}
            </LinkText>
            <LinkText onClick={() => navigate("/blog")}>{t.blog}</LinkText>
          </div>
        </ProfileSection>

        <TabContainer>
          <TabHeader>
            <TabButton
              active={tab === "resume"}
              onClick={() => setTab("resume")}
              position="left"
            >
              {t.resume}
            </TabButton>
            <TabButton
              active={tab === "review"}
              onClick={() => setTab("review")}
              position="right"
            >
              {t.review}
            </TabButton>
          </TabHeader>

          <TabContentBox>
            {tab === "resume" ? (
              <>
                <CardList>
                  {resumeItems.map((item, idx) => (
                    <ResumeCard key={idx}>
                      <img src={item} alt="Resume" />
                    </ResumeCard>
                  ))}
                </CardList>
                <LinkText
                  onClick={() => setResumeItems([...resumeItems, resume1])}
                >
                  + {t.more}
                </LinkText>
              </>
            ) : (
              <>
                <CardList>
                  {reviewItems.map((item, idx) => (
                    <ReviewCard
                      key={item.reviewId || idx}
                      onClick={() => setSelectedReview(item)}
                    >
                      <img src={item.imageBase64} alt="리뷰 이미지" />
                      <strong>{item.reviewTitle}</strong>
                      <RatingBox>
                        ⭐ {item.reviewRating} &nbsp; ❤️ {item.likeCount}
                      </RatingBox>
                      <p>{item.reviewContent.slice(0, 50)}...</p>
                      <BtnBox>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/review/write", {
                              state: {
                                id: item.reviewId,
                                title: item.reviewTitle,
                                content: item.reviewContent,
                                rating: item.reviewRating,
                                image: item.imageBase64,
                              },
                            });
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm("리뷰를 삭제하시겠습니까?")) {
                              try {
                                await api.delete(
                                  `/api/reviews/delete/${item.reviewId}`
                                );
                                setReviewItems((prev) =>
                                  prev.filter(
                                    (r) => r.reviewId !== item.reviewId
                                  )
                                );
                                alert("삭제되었습니다.");
                              } catch (err) {
                                console.error(
                                  "삭제 실패",
                                  err.response?.data || err.message
                                );
                                alert("삭제에 실패했습니다.");
                              }
                            }
                          }}
                        >
                          삭제
                        </button>
                      </BtnBox>
                    </ReviewCard>
                  ))}
                </CardList>
              </>
            )}
          </TabContentBox>
        </TabContainer>

        {selectedReview && (
          <ModalOverlay onClick={() => setSelectedReview(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <img src={selectedReview.imageBase64} alt="상세 이미지" />
              <h2>{selectedReview.reviewTitle}</h2>
              <p>{selectedReview.reviewContent}</p>
              <RatingBox>
                ⭐ {selectedReview.reviewRating} &nbsp; ❤️{" "}
                {selectedReview.likeCount}
              </RatingBox>
              <button onClick={() => setSelectedReview(null)}>닫기</button>
            </ModalContent>
          </ModalOverlay>
        )}
      </Content>
      <Footer language={language} />
    </PageWrapper>
  );
};

export default MyPage;

const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 100px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: white;
  margin-bottom: 40px;
  font-weight: 700;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 50px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileText = styled.div`
  color: white;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-weight: bold;
`;

const LinkText = styled.div`
  color: white;
  font-size: 1rem;
  margin-top: 12px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: #ffeb3b;
  }
`;

const TabContainer = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const TabHeader = styled.div`
  display: flex;
  background-color: #d2ecfb;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
`;

const TabButton = styled.button`
  flex: 1;
  background-color: ${(props) => (props.active ? "#64a8f0" : "#eaf8ff")};
  color: ${(props) => (props.active ? "#ffffff" : "#003049")};
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.9rem 1.2rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-top-left-radius: ${(props) =>
    props.position === "left" ? "16px" : "0"};
  border-top-right-radius: ${(props) =>
    props.position === "right" ? "16px" : "0"};
  border-bottom: ${(props) => (props.active ? "none" : "1px solid #ccc")};

  &:hover {
    background-color: ${(props) => (props.active ? "#64a8f0" : "#d2ecfb")};
  }
`;

const TabContentBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  padding: 40px 30px;
`;

const CardList = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ResumeCard = styled.div`
  width: 200px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-bottom: 1px solid #eee;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ReviewCard = styled.div`
  width: 220px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  padding: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
  cursor: pointer;

  word-break: break-all;
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  strong {
    font-weight: 700;
    font-size: 1rem;
    display: block;
    margin-bottom: 5px;
    color: #333;
  }
`;

const RatingBox = styled.div`
  margin: 8px 0;
  font-size: 0.9rem;
  color: #555;
`;

const BtnBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  button {
    flex: 1;
    background-color: #4a90e2;
    color: white;
    padding: 5px 10px;
    border-radius: 16px;
    font-size: 0.8rem;
    border: none;
    cursor: pointer;
  }
  button:last-child {
    background-color: #e74c3c;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  border-radius: 16px;
  text-align: center;

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
  }

  h2 {
    margin: 20px 0 10px;
  }

  p {
    margin-bottom: 15px;
  }
  button {
    padding: 8px 20px;
    background-color: #64a8f0;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
`;
