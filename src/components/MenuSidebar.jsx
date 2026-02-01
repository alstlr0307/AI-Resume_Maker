import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Home, MessageCircle, User, LogOut, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const slideIn = keyframes`
  from { right: -300px; opacity: 0; }
  to { right: 0; opacity: 1; }
`;

const slideOut = keyframes`
  from { right: 0; opacity: 1; }
  to { right: -300px; opacity: 0; }
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isClosing }) => (isClosing ? "-300px" : "0")};
  width: 280px;
  height: 100vh;
  background: linear-gradient(to bottom, #f0f8ff, #e6f0fb);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.15);
  z-index: 150;
  display: flex;
  flex-direction: column;
  padding: 80px 20px 30px;
  gap: 16px;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.4s ease
    forwards;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 140;

  /* ✅ 블러 & 반투명 */
  backdrop-filter: ${({ isVisible }) =>
    isVisible ? "blur(4px)" : "blur(0px)"};
  background-color: rgba(0, 0, 0, ${({ isVisible }) => (isVisible ? 0.3 : 0)});
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? "auto" : "none")};

  transition: opacity 0.4s ease, backdrop-filter 0.4s ease,
    background-color 0.4s ease;
`;

const MenuButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.08);
  transition: 0.2s;

  &:hover {
    background-color: #dbeeff;
    transform: translateX(-4px);
  }
`;

const SidebarTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-left: 6px;
`;

const CloseButton = styled(X)`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

function MenuSidebar({ isOpen, innerRef, language, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const { user, setUser } = useAuth(); // ✅ Context 사용
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 경로 확인용

  const handleNavigation = (targetPath) => {
    setIsClosing(true);

    setTimeout(() => {
      onClose(); // ✅ 사이드바 닫기

      if (location.pathname !== targetPath) {
        navigate(targetPath); // ✅ 다른 페이지면 이동
      } else {
        navigate(0); // ✅ 같은 페이지면 새로고침
      }
    }, 400);
  };

  const handleLogout = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUser({ loggedIn: false, isAdmin: false, username: "" });
      window.location.href = "/login";
    }, 400);
  };

  const text = {
    home: language === "en" ? "Home" : "홈",
    review: language === "en" ? "Reviews" : "리뷰",
    mypage: language === "en" ? "My Page" : "마이페이지",
    login: language === "en" ? "Login" : "로그인", // ✅ 추가 필요
    logout: language === "en" ? "Logout" : "로그아웃",
    welcome: language === "en" ? "Welcome!" : "환영합니다!",
  };

  return (
    <>
      <Overlay
        isVisible={isOpen || isClosing}
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 400);
        }}
      />

      {(isOpen || isClosing) && (
        <SidebarWrapper ref={innerRef} isClosing={isClosing}>
          <CloseButton size={24} onClick={onClose} />
          <SidebarTitle>{text.welcome}</SidebarTitle>

          <MenuButton onClick={() => handleNavigation("/")}>
            <Home size={18} /> {text.home}
          </MenuButton>

          <MenuButton onClick={() => handleNavigation("/review")}>
            <MessageCircle size={18} /> {text.review}
          </MenuButton>

          <MenuButton
            onClick={() => {
              if (!user.loggedIn) {
                alert(
                  language === "en"
                    ? "Please log in first."
                    : "로그인이 필요합니다."
                );
                navigate("/login");
              } else {
                handleNavigation("/mypage");
              }
            }}
          >
            <User size={18} /> {text.mypage}
          </MenuButton>

          {user.loggedIn ? (
            <MenuButton onClick={handleLogout}>
              <LogOut size={18} /> {text.logout}
            </MenuButton>
          ) : (
            <MenuButton onClick={() => handleNavigation("/login")}>
              <LogOut size={18} /> {text.login}
            </MenuButton>
          )}
        </SidebarWrapper>
      )}
    </>
  );
}

export default MenuSidebar;
