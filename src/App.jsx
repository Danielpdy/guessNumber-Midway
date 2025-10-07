import { useState } from 'react'
import './App.css'

function App() {
  const randomNumber = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;
  
  const [playerName, setPlayerName] = useState("");
  const [attemps, setAttemps] = useState(null );
  const [mode, setMode ] = useState("name");
  const [input, setInput] = useState();
  const [guess, setGuess] = useState(null);
  const [winnerNumber, setWinnerNumber] = useState(() => randomNumber(1, 100));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [winnerName, setWinnerName] = useState("");

  const handleClick = () => {

    if (mode === "name") {
      setPlayerName(`Welcome ${input.trim()}`);
      setWinnerName(input.trim());
      setAttemps(0);
      setMode("guess");
      setInput("");

    } else {
      const guess = Number(input);
      setGuess(guess);
      const nextAttempts = (attemps ?? 0) + 1;
      setAttemps(nextAttempts)

      const date = new Date().toLocaleDateString();


      if (guess === winnerNumber) {
        const wins = {
          Name: winnerName,
          Attemps: nextAttempts,
          When: date
        };
        setSessions(prev => [...prev, wins]);
      }

      setInput("");

    }
  }

  const playAgain = () => {
    setPlayerName("");
    setAttemps(null);
    setMode("name");
    setInput("");
    setGuess(null);
    setWinnerNumber(randomNumber(1, 100));
  }

  const deleteSession = (index) => {
    setSessions(prev => prev.filter((_, i) => i !== index));
  }
 
  function guessNumber () {
    if (guess === null) return <p></p>;
    if (guess === winnerNumber) return <p className='success'>🎉 You succesfully guessed the number</p>;

    return guess > winnerNumber ? <p>Your number is a little to high!</p>
     : <p>Your number is a little too low!</p>
  }

  function showHistory() {

    if (sessions.length === 0) {
      return <section className='noHistory'>
        <h3>You don't have a game history yet</h3>
        <p>Play some games now!</p>
      </section>
    } else {
    return <table className='gameHistory'>
      <caption><h2>Game History</h2></caption>
      <thead>
        <tr className='historyLabels'>
          <th>Name</th>
          <th>Attemps</th>
          <th>Date Played</th>
        </tr>
      </thead>

      <tbody>
        {sessions.map((i, idx) => (
          <tr className='winnerInfo' key={idx}>
            <td>{i.Name}</td>
            <td>{i.Attemps}</td>
            <td>{i.When}</td>
            <button className='delete'onClick={() => deleteSession(idx)}
            >Delete</button>
          </tr>
        ))}
      </tbody>
      <button onClick={playAgain}>Play Again</button>
    </table>
    }
  };



  return (
    <>
      <div className='mainContainer'>
        <section className='contentContainer'>
          <h1>Guess the number</h1>
          { attemps !== null &&(
          <>
            <p>{playerName}</p>
            <p>{`Attemps: ${attemps}`}</p>
          </>
          )}

          <input className='input' type="text" placeholder={mode === "name" ? "Enter your name"
          : "Enter your guess"} 
          value={input}
          onChange={(e) => setInput(e.target.value)}/>

          <button onClick={handleClick}>
            {mode === "name" ? "Add name" : "Add guess"}
          </button>

          <button className='historyButton' onClick={() => setHistoryOpen(prev => !prev)}>
          {historyOpen ? "Hide game history" : "See game history"}
          </button>

          {guessNumber()} 

          {historyOpen && showHistory()}
        </section>
      </div>
    </>
  )
}

export default App
