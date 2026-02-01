import styled from 'styled-components';

export const Content = styled.div`
  flex: 1;
  padding: 3rem 4rem;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 2rem;
`;

export const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

export const ImageLabel = styled.label`
  width: 400px;
  height: 600px;
  background-color: white;
  border-radius: 8px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

export const PlaceholderText = styled.div`
  color: #999;
`;

export const RatingBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-right: 1rem;
`;

export const Star = styled.span`
  color: ${(props) => (props.filled ? "#FFD700" : "#ccc")};
  font-size: 1.8rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;

export const InputBox = styled.div`
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 160px;
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  font-family: inherit;
`;

export const CharCount = styled.div`
  text-align: right;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.3rem;
`;

export const SubmitButton = styled.button`
  background-color: #157aac;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 999px;
  display: block;
  margin: 0 auto;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #125f8d;
  }
`;
