import React, { useEffect, useState } from 'react';

const ApproveUser = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://sarm-server.duckdns.org:8888/approval/approve`, {
      method: 'GET',
      credentials: 'include', // ✅ JSESSIONID 세션 쿠키 자동 포함
    })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('승인 실패');
      }
    })
    .then((data) => setMessage(data))
    .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      {message && <p>{message}</p>} {/* 성공 메시지 */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 오류 메시지 */}
    </div>
  );
};

export default ApproveUser;
