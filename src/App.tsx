import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { SpaceBackground } from './components/layout/SpaceBackground';
import { AuthModal } from './components/ui/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { GalaxyMapPage } from './pages/GalaxyMapPage';
import { MateriPage } from './pages/MateriPage';
import { GameMissionPage } from './pages/GameMissionPage';
import { ResultsPage } from './pages/ResultsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { UserProfile, GameProgress, MissionResult } from './types/game';
import { Planet } from './types/math';
import { PLANETS } from './data/planets';
import { authService } from './services/authService';
import { gameService } from './services/gameService';
import { soundEffects } from './utils/soundEffects';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active mission state
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(PLANETS[0]);
  const [selectedMateriPlanetId, setSelectedMateriPlanetId] = useState<string>('tangensia');
  const [newlyUnlockedPlanetId, setNewlyUnlockedPlanetId] = useState<string | null>(null);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, GameProgress>>({});

  // Last completed mission result for ResultsPage
  const [lastMissionResult, setLastMissionResult] = useState<MissionResult | null>(null);
  const [lastQuestionHistory, setLastQuestionHistory] = useState<
    { questionId: string; isCorrect: boolean; userAnswer: string; scoreEarned: number }[]
  >([]);

  // Load auth user on initial render
  useEffect(() => {
    const initAuth = async () => {
      const profile = await authService.getCurrentProfile();
      if (profile) {
        setCurrentUser(profile);
        const prog = await gameService.getUserProgress(profile.id);
        setUserProgress(prog);
      } else {
        const guestProg = await gameService.getUserProgress('guest');
        setUserProgress(guestProg);
      }
    };
    initAuth();
  }, []);

  const handleAuthSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    const prog = await gameService.getUserProgress(user.id);
    setUserProgress(prog);
  };

  const handleSignOut = async () => {
    soundEffects.playClick();
    await authService.signOut();
    setCurrentUser(null);
    const guestProg = await gameService.getUserProgress('guest');
    setUserProgress(guestProg);
    setActivePage('landing');
  };

  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMateri = (planetId: string) => {
    setSelectedMateriPlanetId(planetId);
    setActivePage('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMission = (planetId: string, challenge = false) => {
    const targetPlanet = PLANETS.find((p) => p.id === planetId) || PLANETS[0];
    setSelectedPlanet(targetPlanet);
    setIsChallengeMode(challenge);
    setActivePage('mission');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMission = async (results: {
    planetId: string;
    totalScore: number;
    correctCount: number;
    timeSpentSeconds: number;
    questionHistory: {
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      scoreEarned: number;
    }[];
  }) => {
    const userToSave = currentUser || {
      id: 'guest',
      username: 'kadet_antariksa',
      displayName: 'Kadet Antariksa',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CadetGuest',
      xp: 560,
      crystals: 8,
      level: 1,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const outcome = await gameService.submitMissionResult(
      userToSave,
      results.planetId,
      results.totalScore,
      results.correctCount,
      results.timeSpentSeconds
    );

    if (currentUser) {
      setCurrentUser(outcome.updatedProfile);
    }
    const updatedProg = await gameService.getUserProgress(userToSave.id);
    setUserProgress(updatedProg);

    if (outcome.newlyUnlockedPlanetId) {
      setNewlyUnlockedPlanetId(outcome.newlyUnlockedPlanetId);
    }

    setLastMissionResult(outcome.missionResult);
    setLastQuestionHistory(results.questionHistory);
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleProgressUpdate = async (planetId: string, stars: number) => {
    const userId = currentUser ? currentUser.id : 'guest';
    const updatedProg = await gameService.updateModuleProgress(userId, planetId, true, stars);
    setUserProgress(updatedProg);
  };

  const currentPlanetIndex = PLANETS.findIndex((p) => p.id === selectedPlanet.id);
  const hasNextPlanet = currentPlanetIndex >= 0 && currentPlanetIndex < PLANETS.length - 1;

  const handleNextPlanet = () => {
    if (hasNextPlanet) {
      const nextPlanet = PLANETS[currentPlanetIndex + 1];
      handleStartMission(nextPlanet.id, false);
    } else {
      navigateTo('map');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#170D24] text-[#FFF5FF] relative selection:bg-[#FF55C8]/30 selection:text-[#FF55C8] pb-16 sm:pb-0">
      {/* Dynamic 3D starfield canvas background */}
      <SpaceBackground />

      {/* Futuristic Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Pages Router */}
      <main className="flex-1 w-full">
        {activePage === 'landing' && (
          <LandingPage
            currentUser={currentUser}
            onStartExploring={() => navigateTo('map')}
            onViewGalaxyMap={() => navigateTo('map')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'map' && (
          <GalaxyMapPage
            userProgress={userProgress}
            currentUser={currentUser}
            onSelectPlanet={(planetId, challenge) => handleStartMission(planetId, challenge)}
            onOpenMateri={handleOpenMateri}
            onBack={() => navigateTo('landing')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            newlyUnlockedPlanetId={newlyUnlockedPlanetId}
          />
        )}

        {activePage === 'materi' && (
          <MateriPage
            initialPlanetId={selectedMateriPlanetId}
            userProgress={userProgress}
            onStartPractice={(planetId) => handleStartMission(planetId, false)}
            onBackToMap={() => navigateTo('map')}
            onModuleProgressUpdate={handleModuleProgressUpdate}
          />
        )}

        {activePage === 'mission' && (
          <GameMissionPage
            planet={selectedPlanet}
            isChallengeMode={isChallengeMode}
            onCompleteMission={handleCompleteMission}
            onExitMission={() => navigateTo('map')}
          />
        )}

        {activePage === 'results' && lastMissionResult && (
          <ResultsPage
            planet={selectedPlanet}
            missionResult={lastMissionResult}
            questionHistory={lastQuestionHistory}
            onReplay={() => handleStartMission(selectedPlanet.id, isChallengeMode)}
            onBackToMap={() => navigateTo('map')}
            onNextPlanet={handleNextPlanet}
            hasNextPlanet={hasNextPlanet}
          />
        )}

        {activePage === 'leaderboard' && <LeaderboardPage />}

        {activePage === 'dashboard' && (
          <DashboardPage
            currentUser={
              currentUser || {
                id: 'demo-cadet',
                username: 'kadet_antariksa',
                displayName: 'Kadet Antariksa',
                avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cadet1',
                xp: 560,
                crystals: 8,
                level: 5,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            }
            userProgress={userProgress}
            onBack={() => navigateTo('landing')}
            onContinueGame={(planetId) => handleStartMission(planetId, false)}
            onOpenLeaderboard={() => navigateTo('leaderboard')}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            currentUser={currentUser}
            onBackToApp={() => navigateTo('landing')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Bottom Navigation for Mobile (Exact Match with Reference Screen 1-5) */}
      <BottomNav activePage={activePage} onNavigate={navigateTo} />

      {/* Cadet Nickname & Avatar Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        currentUser={currentUser}
      />
    </div>
  );
};

export default App;
