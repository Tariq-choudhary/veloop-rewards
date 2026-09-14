import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import LoginModal from './components/common/LoginModal.jsx';

import GamesPage from './pages/games/GamesPage.jsx';
import GameLoadingPage from './pages/games/GameLoadingPage.jsx';
import GameHomePage from './pages/games/GameHomePage.jsx';
import GameGuidePage from './pages/games/GameGuidePage.jsx';
import GamePlayPage from './pages/games/GamePlayPage.jsx';
import GameResultPage from './pages/games/GameResultPage.jsx';
import GiveawaysPage from './pages/Giveaways/GiveawaysPage.jsx';
import GiveawayDetailsPage from './pages/Giveaways/GiveawayDetailsPage.jsx';
import LevelDashboardPage from './pages/Level/LevelDashboardPage.jsx';
import RewardsPage from './pages/Rewards/RewardsPage.jsx';
import RedeemPage from './pages/Redeem/RedeemPage.jsx';
import WithdrawPage from './pages/Withdraw/WithdrawPage.jsx';

export default function App() {
  return (
    <>
      <Header />
      <LoginModal />

      <Routes>
        <Route path="/" element={<Navigate to="/games" replace />} />

        <Route path="/games" element={<GamesPage />} />
        <Route
          path="/games/:gameId/loading"
          element={<GameLoadingPage />}
        />
        <Route
          path="/games/:gameId/guide"
          element={<GameGuidePage />}
        />
        <Route
          path="/games/:gameId/play"
          element={<GamePlayPage />}
        />
        <Route
          path="/games/:gameId/result"
          element={<GameResultPage />}
        />
        <Route
          path="/games/:gameId"
          element={<GameHomePage />}
        />

        <Route path="/giveaways" element={<GiveawaysPage />} />
        <Route
          path="/giveaway/:slug"
          element={<GiveawayDetailsPage />}
        />

        <Route
          path="/level"
          element={<LevelDashboardPage />}
        />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />

        <Route path="*" element={<Navigate to="/games" replace />} />
      </Routes>
    </>
  );
}