import { useState } from 'react'
import './App.css'

function App() {
  const randomNumber = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;
  
  const [playerName, setPlayerName] = useState("");
  const [attemps, setAttemps] = useState(0);
  const [showAttemps, setShowAttemps] = useState(null);
  const [mode, setMode ] = useState("name");
  const [input, setInput] = useState();
  const [guess, setGuess] = useState(null);
  const [winnerNumber, setWinnerNumber] = useState(() => randomNumber(1, 100));


  const handleClick = () => {

    if (mode === "name") {
    setPlayerName(`Welcome ${input.trim()}`);
    setShowAttemps(`Attempts: ${attemps}`);
    setMode("guess");
    setInput("");
    } else {
      const guess = Number(input);
      setGuess(guess);
      setShowAttemps(`Attemps: ${attemps + 1}`);
      setInput("");

    }
  }

  function guessNumber () {
    if (guess === null) return <p></p>;
    if (guess === winnerNumber) return <p>You succesfully guessed the number</p>;
    return guess > winnerNumber ? <p>Your number is a little to high!</p>
     : <p>Your number is a little too low!</p>;
  }



  return (
    <>
      <div className='mainContainer'>
        <section className='contentContainer'>
          <h1>Guess the number</h1>
          <p>{playerName}</p>
          <p>{showAttemps}</p>

          <input className='input' type="text" placeholder={mode === "name" ? "Enter your name"
          : "Enter your guess"} 
          value={input}
          onChange={(e) => setInput(e.target.value)}/>

          <button onClick={handleClick}>
            {mode === "name" ? "Add name" : "Add guess"}
          </button>

           {guessNumber()} 
        </section>
      </div>
    </>
  )
}

export default App
