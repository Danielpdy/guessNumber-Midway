import { useState } from 'react'
import './App.css'

function App() {
  const randomNumber = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;
  
  const [playerName, setPlayerName] = useState("");
  const [attemps, setAttemps] = useState(null);
  const [mode, setMode] = useState("name");
  const [input, setInput] = useState("");
  const [guess, setGuess] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [range, setRange] = useState({ min: 1, max: 100 });
  const [winnerNumber, setWinnerNumber] = useState(() => randomNumber(1, 100));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [hints, setHints] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [theme, setTheme] = useState("light");
  const [showCelebration, setShowCelebration] = useState(false);

  const difficulties = {
    easy: { min: 1, max: 50, name: "Easy", color: "#10b981" },
    medium: { min: 1, max: 100, name: "Medium", color: "#f59e0b" },
    hard: { min: 1, max: 500, name: "Hard", color: "#ef4444" }
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    const newRange = { min: difficulties[level].min, max: difficulties[level].max };
    setRange(newRange);
    setWinnerNumber(randomNumber(newRange.min, newRange.max));
    setGuess(null);
    setHints([]);
    setHintsUsed(0);
  };

  const getHint = () => {
    if (hintsUsed >= 2) return;
    
    const newHints = [...hints];
    if (hintsUsed === 0) {
      newHints.push(winnerNumber % 2 === 0 ? "The number is EVEN" : "The number is ODD");
    } else if (hintsUsed === 1) {
      const midpoint = Math.floor((range.min + range.max) / 2);
      newHints.push(winnerNumber > midpoint 
        ? `The number is in the upper half (${midpoint + 1}-${range.max})` 
        : `The number is in the lower half (${range.min}-${midpoint})`);
    }
    setHints(newHints);
    setHintsUsed(hintsUsed + 1);
  };

  const handleClick = () => {
    if (mode === "name") {
      if (!input.trim()) return;
      setPlayerName(`Welcome ${input.trim()}`);
      setWinnerName(input.trim());
      setAttemps(0);
      setMode("guess");
      setInput("");
    } else {
      const guessNum = Number(input);
      if (isNaN(guessNum) || guessNum < range.min || guessNum > range.max) return;
      
      setGuess(guessNum);
      const nextAttempts = (attemps ?? 0) + 1;
      setAttemps(nextAttempts);

      const date = new Date().toLocaleDateString();

      if (guessNum === winnerNumber) {
        const score = calculateScore(nextAttempts, hintsUsed, difficulty);
        const wins = {
          Name: winnerName,
          Attemps: nextAttempts,
          When: date,
          Difficulty: difficulties[difficulty].name,
          Score: score,
          HintsUsed: hintsUsed
        };
        setSessions(prev => [...prev, wins]);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      setInput("");
    }
  };

  const calculateScore = (attempts, hints, diff) => {
    const baseScore = { easy: 50, medium: 100, hard: 200 }[diff];
    const attemptPenalty = attempts * 5;
    const hintPenalty = hints * 10;
    return Math.max(baseScore - attemptPenalty - hintPenalty, 10);
  };

  const playAgain = () => {
    setPlayerName("");
    setAttemps(null);
    setMode("name");
    setInput("");
    setGuess(null);
    setWinnerNumber(randomNumber(range.min, range.max));
    setHints([]);
    setHintsUsed(0);
    setShowCelebration(false);
  };

  const deleteSession = (index) => {
    setSessions(prev => prev.filter((_, i) => i !== index));
  };

  const calculateStats = () => {
    if (sessions.length === 0) return null;
    
    const totalGames = sessions.length;
    const avgAttempts = (sessions.reduce((sum, s) => sum + s.Attemps, 0) / totalGames).toFixed(1);
    const bestGame = sessions.reduce((best, s) => s.Attemps < best.Attemps ? s : best);
    const totalScore = sessions.reduce((sum, s) => sum + s.Score, 0);
    
    return { totalGames, avgAttempts, bestGame, totalScore };
  };
 
  function guessNumber() {
    if (guess === null) return null;
    if (guess === winnerNumber) {
      return (
        <div className="success-message">
          <p className="success-title">🎉 You successfully guessed the number!</p>
          <p className="success-score">Score: {calculateScore(attemps, hintsUsed, difficulty)} points</p>
        </div>
      );
    }

    return (
      <div className="feedback-message">
        {guess > winnerNumber ? (
          <p className="feedback-text">📉 Your number is too high!</p>
        ) : (
          <p className="feedback-text">📈 Your number is too low!</p>
        )}
      </div>
    );
  }

  function showHistory() {
    if (sessions.length === 0) {
      return (
        <section className="no-history">
          <h3>No game history yet</h3>
          <p>Play some games to build your history!</p>
        </section>
      );
    }

    const sortedSessions = [...sessions].sort((a, b) => b.Score - a.Score);

    return (
      <div className="history-container">
        <table className="game-table">
          <caption className="table-caption">Game History</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Attempts</th>
              <th>Difficulty</th>
              <th>Score</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedSessions.map((session, idx) => (
              <tr key={idx}>
                <td>{session.Name}</td>
                <td>{session.Attemps}</td>
                <td>
                  <span className={`difficulty-badge difficulty-${session.Difficulty.toLowerCase()}`}>
                    {session.Difficulty}
                  </span>
                </td>
                <td className="score-cell">{session.Score}</td>
                <td>{session.When}</td>
                <td>
                  <button 
                    onClick={() => deleteSession(sessions.indexOf(session))}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={playAgain} className="play-again-btn">
          Play Again
        </button>
      </div>
    );
  }

  function showStats() {
    const stats = calculateStats();
    if (!stats) {
      return <p className="no-stats">Play some games to see statistics!</p>;
    }

    return (
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-number stat-purple">{stats.totalGames}</p>
          <p className="stat-label">Total Games</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-blue">{stats.avgAttempts}</p>
          <p className="stat-label">Avg Attempts</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-green">{stats.bestGame.Attemps}</p>
          <p className="stat-label">Best Game</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-orange">{stats.totalScore}</p>
          <p className="stat-label">Total Score</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      <div className="main-wrapper">
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="theme-toggle"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="game-card">
          <h1 className="main-title">Guess the Number</h1>

          {mode === "name" && (
            <div className="difficulty-section">
              <p className="difficulty-label">Choose Difficulty:</p>
              <div className="difficulty-buttons">
                {Object.entries(difficulties).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleDifficultyChange(key)}
                    className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                    style={{ backgroundColor: value.color }}
                  >
                    <span className="difficulty-name">{value.name}</span>
                    <br />
                    <span className="difficulty-range">({value.min}-{value.max})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {attemps !== null && (
            <div className="game-info">
              <p className="player-name">{playerName}</p>
              <p className="attempts-count">
                <span className="attempts-number">Attemps: {attemps}</span>
              </p>
              <p className="range-info">
                Range: {range.min} - {range.max}
              </p>
            </div>
          )}

          <input 
            className="game-input"
            type="text" 
            placeholder={mode === "name" ? "Enter your name" : `Enter guess (${range.min}-${range.max})`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleClick()}
          />

          <button 
            onClick={handleClick}
            className="submit-btn"
          >
            {mode === "name" ? "Start Game" : "Submit Guess"}
          </button>

          {mode === "guess" && guess !== winnerNumber && (
            <div className="hints-section">
              <button 
                onClick={getHint}
                disabled={hintsUsed >= 2}
                className={`hint-btn ${hintsUsed >= 2 ? 'disabled' : ''}`}
              >
                💡 Get Hint ({2 - hintsUsed} left)
              </button>
              {hints.length > 0 && (
                <div className="hints-display">
                  {hints.map((hint, idx) => (
                    <p key={idx} className="hint-text">🔍 {hint}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {showCelebration && (
            <div className="celebration">
              🎊🎉🎊
            </div>
          )}

          {guessNumber()}

          <div className="action-buttons">
            <button 
              onClick={() => setHistoryOpen(!historyOpen)}
              className="action-btn history-btn"
            >
              {historyOpen ? "Hide History" : "📜 Game History"}
            </button>
            <button 
              onClick={() => setStatsOpen(!statsOpen)}
              className="action-btn stats-btn"
            >
              {statsOpen ? "Hide Stats" : "📊 Statistics"}
            </button>
          </div>

          {historyOpen && <div className="section-display">{showHistory()}</div>}
          {statsOpen && <div className="section-display">{showStats()}</div>}
        </div>
      </div>
    </div>
  );
}

export default App