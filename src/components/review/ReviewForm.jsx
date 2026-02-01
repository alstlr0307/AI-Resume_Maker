import React from 'react';
import ReviewImageUpload from './ReviewImageUpload';
import ReviewRating from './ReviewRating';
import {
  Title,
  InputBox,
  Input,
  Textarea,
  Label,
  CharCount,
  SubmitButton,
  Content
} from './reviewWriteStyles';

const ReviewForm = ({
  image, handleImageChange,
  rating, setRating,
  title, setTitle, maxTitleLength,
  content, setContent, maxContentLength
}) => {
  return (
    <Content>
      <Title>리뷰 작성하기</Title>

      <ReviewImageUpload image={image} handleImageChange={handleImageChange} />

      <ReviewRating rating={rating} setRating={setRating} />

      <InputBox>
        <Label>리뷰 제목</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= maxTitleLength) {
              setTitle(e.target.value);
            }
          }}
        />
        <CharCount>{title.length} / {maxTitleLength}</CharCount>
      </InputBox>

      <InputBox>
        <Label>리뷰 내용</Label>
        <Textarea
          placeholder="✏️ 리뷰를 작성해주세요."
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= maxContentLength) {
              setContent(e.target.value);
            }
          }}
        />
        <CharCount>{content.length} / {maxContentLength}</CharCount>
      </InputBox>

      <SubmitButton>등록하기</SubmitButton>
    </Content>
  );
};

export default ReviewForm;
