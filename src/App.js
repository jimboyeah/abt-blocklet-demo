import {useRef, useState} from 'react';

import './App.css';
import goat from './img/goat.png';
import Explorer from './Explorer';

function App() {
  const ref = useRef(null);
  const [state, setV] = useState("")

  let doKeydown = (ev) => {
    if(ev.key === "Enter" && ref.current.value !== ""){
      setV(ref.current.value);
    }
  }
  
  let doQuery = (ev) => {
    setV(ref.current.value);
  }
  
  if(state !== "") return (
    <header className="App-header">
      <Explorer hash={state} onError={ ev => {
        setV("");
        alert(ev);
        }}>
      <div className="return" onClick={ev => setV("")}>🏡</div>
      </Explorer>
    </header>
  )      


  return (
    <div className="App">
      <header className="App-header">
        <img src={goat} className="" alt="logo" />
        <h1 className="grow"> Block Explorer </h1>
        <div className="col12">
        <input placeholder="Type Block Hash Here, ex. 1 for the genesis block" className="col34 layL" type="text" 
          ref={ref}
          onKeyDown={ev => doKeydown(ev)}
          defaultValue="150000"/>
          <br />
        <button className="button-minimal" onClick={ev => doQuery(ev)}>Inquire</button>
        </div>
      </header>
    </div>
  );
}

export default App;
