import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { AuthProvider } from './context/AuthContext.jsx';
import { TokenProvider } from './context/TokenContext.jsx';
import { GameCoinProvider } from './context/GameCoinContext.jsx';
import { GameSessionProvider } from './context/GameSessionContext.jsx';
import { GiveawayProvider } from './context/GiveawayContext.jsx';
import { LevelProvider } from './context/LevelContext.jsx';
import { RewardsProvider } from './context/RewardsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TokenProvider>
          <GameCoinProvider>
            <GiveawayProvider>
              <RewardsProvider>
                <LevelProvider>
                  <GameSessionProvider>
                    <App />
                  </GameSessionProvider>
                </LevelProvider>
              </RewardsProvider>
            </GiveawayProvider>
          </GameCoinProvider>
        </TokenProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
