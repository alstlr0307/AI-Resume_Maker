import React from 'react';
import { ImageBox, ImageLabel, PreviewImage, PlaceholderText } from './reviewWriteStyles';

const ReviewImageUpload = ({ image, handleImageChange }) => (
  <ImageBox>
    <ImageLabel htmlFor="imageUpload">
      {image ? <PreviewImage src={image} alt="미리보기" /> : <PlaceholderText>이력서 사진 넣기</PlaceholderText>}
    </ImageLabel>
    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} hidden />
  </ImageBox>
);

export default ReviewImageUpload;
