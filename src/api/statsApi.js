// src/api/statsApi.js
import { stats } from '../testUserProfile/stats';

export const fetchStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stats);
    }, 300);
  });
};
