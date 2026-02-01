import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import api from '../../api/axios'; // 상대 경로 확인 필요


const Wrapper = styled.div`
  padding: 0 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 30px;
  color: #146c94;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 1px 2px 10px rgba(0,0,0,0.1);
  padding: 30px 20px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  span {
    display: block;
    font-size: 2.2rem;
    color: #5cbef7;
    margin-top: 10px;
    font-weight: 900;
  }
`;

function DashboardMain({ language }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalReviews: 0,
    resumeSubmissions: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
      if (!user.loggedIn || !user.isAdmin) {
        alert("접근 권한이 없습니다.");
        navigate('/');
      }
    fetchAllStats();
    }, [user, navigate]);

  const fetchAllStats = async () => {
    try {
      const response = await api.get('/api/user'); // ✅ 토큰 자동 포함
      const users = response.data;

      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.isApproved).length;
      const adminUsers = users.filter(u => u.userRole === 'ADMIN').length;

      // 예시 데이터 (추후 실제 API 연결 시 교체)
      const totalReviews = 0;
      const resumeSubmissions = 0;

      setStats({ totalUsers, activeUsers, adminUsers, totalReviews, resumeSubmissions });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err.message);
    }
  };

  const text = {
    ko: {
      title: '관리자 대시보드',
      statLabels: ['총 사용자 수', '활성 사용자', '관리자 수', '등록된 리뷰', '이력서 제출 수'],
    },
    en: {
      title: 'Admin Dashboard',
      statLabels: ['Total Users', 'Active Users', 'Admins', 'Reviews Posted', 'Resumes Submitted'],
    }
  };

  const t = text[language || 'ko'];

  return (
    <Wrapper>
      <SectionTitle>{t.title}</SectionTitle>

      <CardGrid>
        <StatCard>
          {t.statLabels[0]}
          <span>{stats.totalUsers}</span>
        </StatCard>
        <StatCard>
          {t.statLabels[1]}
          <span>{stats.activeUsers}</span>
        </StatCard>
        <StatCard>
          {t.statLabels[2]}
          <span>{stats.adminUsers}</span>
        </StatCard>
        <StatCard>
          {t.statLabels[3]}
          <span>{stats.totalReviews !== 0 ? stats.totalReviews : '-'}</span>
        </StatCard>
        <StatCard>
          {t.statLabels[4]}
          <span>{stats.resumeSubmissions !== 0 ? stats.resumeSubmissions : '-'}</span>
        </StatCard>
      </CardGrid>
    </Wrapper>
  );
}

export default DashboardMain;
