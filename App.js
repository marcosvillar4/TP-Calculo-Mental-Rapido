import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import GameScreen from './GameScreen';
import MainMenu from './components/menu/MainMenu';
import { DIFFICULTIES, MODES, getTimePerQuestionByDifficulty } from './constants/gameOptions';

const clampRounds = (value) => Math.min(99, Math.max(1, value));

export default function App() {
  const [selectedMode, setSelectedMode] = useState(MODES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[1].id);
  const [playerName, setPlayerName] = useState('');
  const [roundsText, setRoundsText] = useState('10');
  const [runningSettings, setRunningSettings] = useState(null);

  const maxRounds = useMemo(() => {
    const parsed = Number.parseInt(roundsText, 10);
    return Number.isFinite(parsed) ? clampRounds(parsed) : 1;
  }, [roundsText]);

  const timePerQuestion = useMemo(() => getTimePerQuestionByDifficulty(selectedDifficulty), [selectedDifficulty]);

  if (runningSettings) {
    return <GameScreen settings={runningSettings} onExit={() => setRunningSettings(null)} />;
  }

  return (
    <>
      <StatusBar style="light" />
      <MainMenu
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        playerName={playerName}
        setPlayerName={setPlayerName}
        roundsText={roundsText}
        setRoundsText={setRoundsText}
        maxRounds={maxRounds}
        timePerQuestion={timePerQuestion}
        onStartGame={setRunningSettings}
      />
    </>
  );
}
