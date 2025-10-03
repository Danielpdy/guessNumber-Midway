import { useState } from 'react'
import './App.css'

function App() {
  
  const [playerName, setPlayerName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [attemps, setAttemps] = useState(0);
  const [showAttemps, setShowAttemps] = useState(null);
  const [mode, setMode ] = useState("name");
  const [input, setInput] = useState();
  const [guess, setGuess] = useState();
  const [winnerNumber, setWinnerNumber] = useState(() => randomNumber(1, 100));

  const randomNumber = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;

  const handleClick = () => {
    setGreeting(`Welcome ${playerName}`);
    setShowAttemps(`Attempts: ${attemps}`);
    setMode("guess");
    setInput("");
  }

  function guessNumber () {
    if (guess > winnerNumber){
      
    }
  }

  return (
    <>
      <div className='mainContainer'>
        <section className='contentContainer'>
          <h1>Guess the number</h1>
          <p>{greeting}</p>
          <p>{showAttemps}</p>

          <input type="text" placeholder={mode === "name" ? "Enter your name"
            : "Enter your guess"} 
          value={input}
          onChange={(e) => setPlayerName(e.target.value) 
          && setGuess(e.target.value)}/>

          <button onClick={handleClick}>
            {mode === "name" ? "Add name" : "Add guess"}
          </button>

          {mode === "guess" ? <p>text2</p> : <p>text</p>}
        </section>
      </div>
    </>
  )
}

export default App
