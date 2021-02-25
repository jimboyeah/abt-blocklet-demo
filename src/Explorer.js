import {useState} from 'react';

// import goat from './img/goat.png';
import coin from './img/bitcoin.svg';
import out from './img/out.svg';
import to from './img/to.svg';
import spent from './img/spent.svg';
import unspent from './img/unspent.svg';
import './App.css';

export function Pager({count, current=1, size = 10, onPage = ()=>{}}){
  let page = Math.ceil(count/10.0);
  let pager = [];
  let start = current<=10? 1: current - 10;
  let end = current>page-10? page:current+10;
  for(let i=start; i<=end; i++) pager.push(i);
  return (
    <div className="page rows fS layXLV">
      {pager.map(it => (<div key={it} onClick={ ev => onPage(it) } style={{cursor:"pointer"}}>[{it}]</div>))}
    </div>
  )
}

export function loadBlock(hash, setV = ()=>{}, onError = ()=>{}) {
  // https://www.blockchain.com/api/blockchain_api
  return fetch("https://blockchain.info/rawblock/"+hash+"?cors=true")
  .then(res => {
    return res.json();
  })
  .then(json => {
    try{
      setV(json);
    }catch(ex){
      console.log(ex);
    }
    return json;
  })
  .catch(ex => {
    onError(ex)
    console.log(ex);
    return Promise.reject({
      json: () => Promise.resolve(ex),
    })
  });
}

export function formatBTC(value) {
  return (value/100000000).toFixed(8);
}

export function countOut(items) {
  let sum = 0;
  for(let p in items) {
    sum += items[p].value;
  }
  return formatBTC(sum);
}

export function App(props) {
  let {hash} = props;
  const [block, setV] = useState(null)
  const [page, setPage] = useState(1)
  
  if(block == null) {
    loadBlock(hash, setV, props.onError);
    return (
      <header className="App-header">
        <img src={coin} className="App-logo" alt="logo" style={{height:128}} />
        <div className="loading">{/* ❤🧡💚 */}Loading...</div>
        { props.children }
      </header>
    )
  }
  let miner = block.tx[0].out[0].addr;

  let tx = block.tx.slice(10*(page-1), 10*(page-1)+10)

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="grow fxFixed" style={{fontSize: 42}}> <img src={coin} className="inline" alt="logo" /> Block Explorer </h1>
        <h3>Block {block.height}</h3>
        <dl className="columns fXS">
          <div className="rows bb"><dt className="col16 fxFixed taRight">Hash</dt>                     <dd>{hash}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Confirmations</dt>            <dd>Unknown</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Timestamp</dt>                <dd>{new Date(block.time*1000).toLocaleString()}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Height</dt>                   <dd>{block.height}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Miner</dt>                    <dd><a href={"https://www.blockchain.com/btc/address/"+miner}>Unknown</a></dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Number of Transactions</dt>   <dd>{block.tx.length}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Difficulty</dt>               <dd>x</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Merkle root</dt>              <dd>{block.mrkl_root}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Version</dt>                  <dd>{block.ver}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Bits</dt>                     <dd>{block.bits}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Weight</dt>                   <dd>{block.weight}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Size</dt>                     <dd>{block.size}</dd>bytes</div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Nonce</dt>                    <dd>{block.nonce}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Transaction Volume</dt>       <dd>Unknown</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Block Reward</dt>             <dd>Unknown</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Fee Reward</dt>               <dd>{block.fee}</dd> BTC</div>
        </dl>
        <h3>Block Transactions</h3>
        {tx.map( it => 
          <div className="tx fXS columns card bgDarkGray taLeft" style={{width: "70vw"}}>
            <p className="layLV">Hash: {it.hash}</p>
            
            <div className="rows">

              <div className="input columns col49">
              { it.inputs.map(item => 
              <>
                {!item.prev_out && 
                  <div key={item.sequence} className="cLightGreen">COINBASE (Newly Generated Coins)</div>
                }
                {item.prev_out && 
                  <div className="rows fxBetween" key={item.sequence}>
                    <p className="addr">{item.prev_out.addr}</p>
                    <p className="btc">{formatBTC(item.prev_out.value)} BTC</p>
                    <a href={"https://www.blockchain.com/btc/address/"+item.prev_out.addr}>
                      <img className="inline" src={out} alt="out"/>
                    </a>
                  </div>
                }
              </>
              )}
              </div>

              <img className="layL" src={to} alt="to"/>
              
              <div className="out columns col49">
              { it.out.map(item => 
                <div className="rows fxBetween" key={item.sequence}>
                { item.addr === "null" && "OP_RETURN"}
                { item.addr !== "null" && <p className="addr">{item.addr}</p> }
                <p className="btc"> {formatBTC(item.value)} BTC</p>
                <a href={item.addr ==="null"? "#":("https://www.blockchain.com/btc/address/"+item.addr)}>
                  {item.spent && <img className="inline" src={spent} title="Spent" alt="spent"/> }
                  {!item.spent && <img className="inline" src={unspent} title="Unspent" alt="unspent"/> }
                </a>
                </div>
              )}
              <div className="cLightGreen taRight layLV">{ countOut(it.out) } BTC</div>
              </div>

            </div>
            <p className="cLightGreen layLV">Fee: {formatBTC(it.fee)} BTC</p>
          </div>
        )}
        <Pager current={page} onPage={page => setPage(page)} count={block.tx.length} />
        <div className="col12 layXLV">
        { props.children }
        </div>
      </header>
    </div>
  );
}

export default App;
