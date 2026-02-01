import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { likeReview, unlikeReview } from '../api/reviewApi';
import { fetchMyReviews, fetchAllReviews } from "../api/reviewApi";
import { deleteReview } from "../api/reviewApi";

const formatLikeCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + "만";
  }
  return count.toString();
};

const ReviewList = () => {
  const navigate = useNavigate();
  const [allReviews, setAllReviews] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "ko");
  const [page, setPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(3);
  const [reviewType, setReviewType] = useState("인기");

  const [sliderMyLiked, setSliderMyLiked] = useState({});
  const [bottomLikedMap, setBottomLikedMap] = useState({});

  const [myReviews, setMyReviews] = useState([]);
  const [bottomReviews, setBottomReviews] = useState([]);

  const [sliderMyLikes, setSliderMyLikes] = useState({});
  const [bottomLikeCountMap, setBottomLikeCountMap] = useState({});

  const [selectedReview, setSelectedReview] = useState(null);

  const text = {
    popular: language === "ko" ? "인기 리뷰" : "Popular",
    latest: language === "ko" ? "최신 리뷰" : "Latest",
    mine: language === "ko" ? "내 리뷰" : "My Review",
    all: language === "ko" ? "전체 리뷰" : "All Reviews",
    write: language === "ko" ? "내 리뷰 작성하러가기" : "Write a Review",
    person: (count) => `${count}`,
    edit: language === "ko" ? "수정하기" : "Edit",
    delete: language === "ko" ? "삭제하기" : "Delete",
    deleteConfirm:
      language === "ko"
        ? "정말 삭제하시겠습니까?"
        : "Are you sure you want to delete this review?",
    deleteAlert: (title) =>
      language === "ko"
        ? `리뷰 "${title}"가 삭제되었습니다.`
        : `Review "${title}" has been deleted.`,
  };

  const tabList = [
    { type: "인기", label: text.popular },
    { type: "최신", label: text.latest },
    { type: "내", label: text.mine },
  ];

  const handleEdit = (review) => {
    navigate("/review/write", {
      state: {
        id: review.reviewId,
        title: review.reviewTitle,
        content: review.reviewContent,
        rating: review.reviewRating,
        image: review.imageBase64,
      },
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("이 리뷰를 정말 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await deleteReview(id);
      alert("삭제되었습니다.");
      window.location.reload(); // 새로고침으로 반영
    } catch (err) {
      console.error("삭제 실패", err);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const updateImagesPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1200) setImagesPerPage(3);
      else if (width >= 768) setImagesPerPage(2);
      else setImagesPerPage(1);
    };
    updateImagesPerPage();
    window.addEventListener("resize", updateImagesPerPage);
    return () => window.removeEventListener("resize", updateImagesPerPage);
  }, []);

  useEffect(() => {
    fetchMyReviews()
      .then((res) => {
        setMyReviews(res.data || []);

        const likedMap = {};
        const likeCountMap = {};
        (res.data || []).forEach((review) => {
          likedMap[review.reviewId] = review.likedByMe;
          likeCountMap[review.reviewId] = review.likeCount;
        });
        setSliderMyLiked(likedMap);
        setSliderMyLikes(likeCountMap);
      })
      .catch(() => {
        setMyReviews([]);
        setSliderMyLiked({});
        setSliderMyLikes({});
      });

    fetchAllReviews()
      .then((res) => {
        setBottomReviews(res.data || []);
        setAllReviews(res.data || []);
        console.log("전체 리뷰:", res.data);
        res.data.forEach(r => console.log("createdAt:", r.createdAt));

        const likedMap = {};
        const likeCountMap = {};
        (res.data || []).forEach((review) => {
          likedMap[review.reviewId] = review.likedByMe;
          likeCountMap[review.reviewId] = review.likeCount;
        });
        setBottomLikedMap(likedMap);
        setBottomLikeCountMap(likeCountMap);

        setSliderMyLiked(likedMap);
        setSliderMyLikes(likeCountMap);
      })
      .catch(() => {
        setBottomReviews([]);
        setBottomLikedMap({});
        setBottomLikeCountMap({});
      });
  }, []);

  const getSliderData = () => {
  if (reviewType === "내") {
    return [
      myReviews || [],
      sliderMyLiked || {},
      setSliderMyLiked || (() => {}),
      sliderMyLikes || {},
      setSliderMyLikes || (() => {}),
    ];
  }

  let reviews = [];

  if (reviewType === "인기") {
    reviews = [...allReviews].sort((a, b) => b.likeCount - a.likeCount);
  } else if (reviewType === "최신") {
    reviews = [...allReviews].filter(r => r.createdAt).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  return [
    reviews || [],
    bottomLikedMap || {},
    setBottomLikedMap || (() => {}),
    bottomLikeCountMap || {},
    setBottomLikeCountMap || (() => {}),
  ];
};

  const data = getSliderData();
  const [sliderReviews] = data;

  const toggleSliderLike = async (id) => {
  try {
    const isLiked = sliderMyLiked[id];

    if (isLiked) {
      await unlikeReview(id);
      setSliderMyLiked(prev => ({ ...prev, [id]: false }));
      setSliderMyLikes(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 0) }));

      // 👇 하단 리뷰에도 반영
      setBottomLikedMap(prev => ({ ...prev, [id]: false }));
      setBottomLikeCountMap(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 0) }));
    } else {
      await likeReview(id);
      setSliderMyLiked(prev => ({ ...prev, [id]: true }));
      setSliderMyLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

      // 👇 하단 리뷰에도 반영
      setBottomLikedMap(prev => ({ ...prev, [id]: true }));
      setBottomLikeCountMap(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  } catch (error) {
    console.error("슬라이더 좋아요 토글 실패", error);
    alert("좋아요 처리 중 오류가 발생했습니다.");
  }
};

const toggleBottomLike = async (id) => {
  try {
    const isLiked = bottomLikedMap[id];

    if (isLiked) {
      await unlikeReview(id);
      setBottomLikedMap(prev => ({ ...prev, [id]: false }));
      setBottomLikeCountMap(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 0) }));

      // 👇 슬라이더에도 반영
      setSliderMyLiked(prev => ({ ...prev, [id]: false }));
      setSliderMyLikes(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 0) }));
    } else {
      await likeReview(id);
      setBottomLikedMap(prev => ({ ...prev, [id]: true }));
      setBottomLikeCountMap(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

      // 👇 슬라이더에도 반영
      setSliderMyLiked(prev => ({ ...prev, [id]: true }));
      setSliderMyLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  } catch (error) {
    console.error("하단 좋아요 토글 실패", error);
    alert("좋아요 처리 중 오류가 발생했습니다.");
  }
};

  const handleCardClick = (review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const totalPages = Math.ceil((sliderReviews?.length || 0) / imagesPerPage);
  const visibleSlider = (sliderReviews || []).slice(
    page * imagesPerPage,
    page * imagesPerPage + imagesPerPage
  );

  const descLimit = reviewType === "내" ? 16 : 35;

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    for (let i = 0; i < full; i++)
      stars.push(<FaStar key={`full-${i}`} color="rgb(255, 230, 0)" />);
    if (half) stars.push(<FaStarHalfAlt key="half" color="rgb(255, 230, 0)" />);
    for (let i = 0; i < empty; i++)
      stars.push(<FaRegStar key={`empty-${i}`} color="#ccc" />);

    return stars;
  };

  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedReview]);

  return (
    <PageWrapper>
      <Header onChangeLanguage={setLanguage} language={language} />
      <Container>
        <TopBoxButtonsWrapper>
          {tabList.map(({ type, label }) => (
            <TopButton
              key={type}
              isActive={reviewType === type}
              onClick={() => {
                setReviewType(type);
                setPage(0);
              }}
            >
              {label}
            </TopButton>
          ))}
        </TopBoxButtonsWrapper>

        <TopBox>
          <SliderWrapper $perPage={imagesPerPage}>
            <NavButton onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
              ◀
            </NavButton>
            <ImageGrid $perPage={imagesPerPage}>
              {visibleSlider.map((review, index) => (
                <ImageCard
                  hoverable
                  key={review.reviewId || index}
                  onClick={() => handleCardClick(review)}
                >
                  <img src={review.imageBase64} alt={`resume-${review.reviewId}`} />
                  <SliderCardTextWrapper>
                    <HeartRow>
                      <HeartButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSliderLike(review.reviewId);
                        }}
                      >
                        {sliderMyLiked[review.reviewId] ? <FaHeart /> : <FaRegHeart />}
                      </HeartButton>
                      <LikeCountText>{formatLikeCount(sliderMyLikes[review.reviewId] || 0)}</LikeCountText>
                      <RatingWrapper>
                        {renderStars(review.reviewRating)}
                        <RatingValue>{review.reviewRating}</RatingValue>
                      </RatingWrapper>
                    </HeartRow>
                    <CardTitle>
                      {review.reviewTitle
                        ? review.reviewTitle.length > 10
                          ? `${review.reviewTitle.slice(0, 10)}...`
                          : review.reviewTitle
                        : "제목 없음"}
                    </CardTitle>
                    <CardDesc>
                      {review.reviewContent
                        ? review.reviewContent.length > descLimit
                          ? `${review.reviewContent.slice(0, descLimit)}...`
                          : review.reviewContent
                        : "설명 없음"}
                    </CardDesc>
                    {reviewType === "내" && (
                      <EditDeleteButtonWrapper>
                        <EditButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(review);
                          }}
                        >
                          {text.edit}
                        </EditButton>
                        <DeleteButton
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(text.deleteConfirm)) {
                              handleDelete(review.reviewId);
                            }
                          }}
                        >
                          {text.delete}
                        </DeleteButton>
                      </EditDeleteButtonWrapper>
                    )}
                  </SliderCardTextWrapper>
                </ImageCard>
              ))}
            </ImageGrid>
            <NavButton
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
            >
              ▶
            </NavButton>
          </SliderWrapper>
        </TopBox>

        <CenterLabel>{text.all}</CenterLabel>

        <BottomBox>
          <ScrollableList>
            {bottomReviews.map((review, index) => (
              <BottomReviewCard key={review.reviewId || index} onClick={() => handleCardClick(review)}>
                <img src={review.imageBase64} alt={`resume-${review.reviewId}`} />
                <CardRightContent>
                  <HeartRow>
                    <HeartButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBottomLike(review.reviewId);
                      }}
                    >
                      {bottomLikedMap[review.reviewId] ? <FaHeart /> : <FaRegHeart />}
                    </HeartButton>
                    <LikeCountText>{formatLikeCount(bottomLikeCountMap[review.reviewId] || 0)}</LikeCountText>
                    <RatingWrapper>
                      {renderStars(review.reviewRating)}
                      <RatingValue>{review.reviewRating}</RatingValue>
                    </RatingWrapper>
                  </HeartRow>
                  <BottomCardTextWrapper>
                    <CardTitle>
                      {review.reviewTitle
                        ? review.reviewTitle.length > 10
                          ? `${review.reviewTitle.slice(0, 10)}...`
                          : review.reviewTitle
                        : "제목 없음"}
                    </CardTitle>
                    <CardDesc>
                      {review.reviewContent
                        ? review.reviewContent.length > 35
                          ? `${review.reviewContent.slice(0, 35)}...`
                          : review.reviewContent
                        : "설명 없음"}
                    </CardDesc>
                  </BottomCardTextWrapper>
                </CardRightContent>
              </BottomReviewCard>
            ))}
            <BottomPaddingSpacer />
          </ScrollableList>
        </BottomBox>

        <WriteButton onClick={() => navigate("/review/write")}>{text.write}</WriteButton>

        {selectedReview && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>X</CloseButton>
              <ModalBody>
                <img src={selectedReview.imageBase64} alt="modal" />
                <h2>{selectedReview.reviewTitle}</h2>
                <p>{selectedReview.reviewContent}</p>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
      <Footer language={language} />
    </PageWrapper>
  );
};

export default ReviewList;


// ================== 스타일 ==================
const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  flex: 1; 
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
`;

const TopBoxButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 90%;
  max-width: 1000px;
  margin-top: 6rem;
  margin-bottom: -32px;
  z-index: 2;
`;

const TopButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: ${({ isActive }) => (isActive ? "rgb(129, 215, 255)" : "#64a8f0")};
  color: white;
  border: none;
  border-radius: 16px 16px 0 0;
  font-size: ${({ isActive }) => (isActive ? "1.05rem" : "0.95rem")};
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  transform-origin: top left;

  &:hover {
    background-color: rgb(129, 215, 255);
    transform: scaleX(1.1) scaleY(1.1);
  }
`;

const TopBox = styled.div`
  width: 90%;
  max-width: 1000px;
  background-color: rgb(129, 215, 255);
  border-radius: 0 16px 16px 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem 0;
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  overflow: visible;
  width: 100%;
  max-width: calc(240px * ${ (props) => props.$perPage } + 1rem * (${ (props) => props.$perPage } - 1) + 5rem);
`;

const NavButton = styled.button`
  font-size: 1.8rem;
  padding: 0.5rem;
  background: none;
  color: rgb(255, 255, 255);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: rgb(0, 174, 255);
    transform: scale(1.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

const ImageGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
  width: calc(240px * ${ (props) => props.$perPage } + 1rem * (${ (props) => props.$perPage } - 1));
  transform: translateX(${ (props) => `-${props.offset}px` });
  transition: transform 0.4s ease-in-out;
`;

const ImageCard = styled.div`
  position: relative;
  width: 240px;
  height: 340px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
  }

  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.03);
    z-index: 10;
  }
`;

const HeartButton = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  color: rgb(255, 0, 0);
  cursor: pointer;
  align-self: flex-start;
  margin: 0.4rem 0 0 0.5rem;

  &:hover {
    transform: scale(1.2);
  }
`;

const HeartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.5rem;
`;

const LikeCountText = styled.span`
  font-size: 0.85rem;
  color: rgb(0, 0, 0);
  margin-top: 0.2rem;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: 0.4rem;
`;

const RatingValue = styled.span`
  font-size: 0.85rem;
  color: rgb(0, 0, 0);
  font-weight: bold;
`;

const SliderCardTextWrapper = styled.div`
  padding: 0.5rem;
  width: 100%;
  text-align: left;
  padding-left: 2rem;
`;

const BottomCardTextWrapper = styled.div`
  padding: 0.5rem;
  width: 100%;
  text-align: left;
  padding-left: 2rem;
`;

const CardTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #003049;
`;

const CardDesc = styled.div`
  font-size: 0.95rem;
  color: #555;
  margin-top: 0.3rem;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CenterLabel = styled.h2`
  font-size: 1.8rem;
  color: white;
  background-color: rgba(61, 194, 255, 0.47);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 0.4rem 1rem;
  border-radius: 12px;
  text-align: center;
  display: inline-block;
`;

const BottomBox = styled.div`
  width: 90%;
  max-width: 1000px;
  height: 460px;
  background-color: rgb(129, 215, 255);
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: hidden;
`;

const ScrollableList = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  padding-bottom: 0rem;

  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(129, 215, 255);
    border-radius: 16px;
    border: 4px solid transparent;
    background-clip: content-box;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #3a91d8;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1fbff;
    border-radius: 4px;
  }
`;

const BottomPaddingSpacer = styled.div`
  height: 2.5rem;
  flex-shrink: 0;
  pointer-events: none;
`;

const BottomReviewCard = styled.div`
  cursor: pointer;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
  overflow: hidden;

  img {
    width: 100px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
  }

  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }

  flex-shrink: 0;
`;

const CardRightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const WriteButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.8rem 1.6rem;
  background-color: #146c94;
  color: white;
  border: 2px solid #146c94;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: white;
    color: #146c94;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ModalBody = styled.div`
  overflow-y: auto;
  padding: 2rem;
  max-height: 80vh;
  box-sizing: border-box;

  img {
    width: 100%;
    height: auto;
    margin-bottom: 1rem;
  }

  h2 {
    margin-top: 0;
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(129, 215, 255);
    border-radius: 12px;
    border: 1.5px solid white;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #217dbb;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background-color: rgb(94, 198, 247);
  color: white;
  border: 2px solid transparent;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: white;
    color: rgb(94, 198, 247);
    border-color: rgb(94, 198, 247);
  }
`;

const StickyFooter = styled.footer`
  background-color: #222;
  color: white;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.85rem;
  width: 100%;
  margin-top: auto;
`;

const EditDeleteButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  background-color: #4a90e2;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #4a90e2;
    border: 2px solid #4a90e2;
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #e74c3c;
    border: 2px solid #e74c3c;
  }
`;