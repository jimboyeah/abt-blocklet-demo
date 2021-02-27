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
  .then(res => res.json())
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

export function pretty(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function fixed(value, fract = 2) {
  return pretty(value.toFixed(fract));
}

export function fixed3(value) {
  return fixed(value, 3);
}

export function SAT2BTC(value) {
  return (value/100000000).toFixed(8);
}

export function countOut(items) {
  let sum = 0;
  for(let p in items) {
    sum += items[p].value;
  }
  return SAT2BTC(sum);
}

export function getBlockTotal(block) {
  let sum = 0, ins = 0, out = 0, spenti = 0, spento = 0, fee = 0;
  block.tx.map(it => {
    fee += it.fee;
    it.out.map(itout => {
      out += itout.value;
      if(itout.spent === true) spento += itout.value;
      return itout;
    })
    it.inputs.map(itins => {
      if(!itins.prev_out) return itins;
      ins += itins.prev_out.value;
      if(itins.prev_out.spent === true) spenti += itins.prev_out.value;
      return itins;
    })
    return it;
  })
  sum = SAT2BTC(spenti-fee);
  console.log({
    sum: SAT2BTC(sum), 
    fee: SAT2BTC(fee), 
    ins: SAT2BTC(ins), 
    out: SAT2BTC(out), 
    spenti: SAT2BTC(spenti), 
    spento: SAT2BTC(spento)})
  return sum;
}

export function Explorer(props) {
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
          <div className="rows bb"><dt className="col16 fxFixed taRight">Hash</dt>                     <dd className="addr col34">{block.hash}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Confirmations</dt>            <dd>Unknown</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Timestamp</dt>                <dd>{new Date(block.time*1000).toLocaleString()}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Height</dt>                   <dd>{pretty(block.height)}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Miner</dt>                    <dd><a href={"https://www.blockchain.com/btc/address/"+miner}>Unknown</a></dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Number of Transactions</dt>   <dd>{block.tx.length}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Difficulty</dt>               <dd>18,670,168,558,399.59 (2021/02/27)</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Merkle root</dt>              <dd className="addr col34">{block.mrkl_root}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Version</dt>                  <dd>{block.ver}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Bits</dt>                     <dd>{pretty(block.bits)}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Weight</dt>                   <dd>{pretty(block.weight)} WU</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Size</dt>                     <dd>{pretty(block.size)}</dd>bytes</div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Nonce</dt>                    <dd>{pretty(block.nonce)}</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Transaction Volume</dt>       <dd>{getBlockTotal(block)} BTC</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Block Reward</dt>             <dd>6.25000000 BTC (Since 2020)</dd></div>
          <div className="rows bb"><dt className="col16 fxFixed taRight">Fee Reward</dt>               <dd>{SAT2BTC(block.fee)} BTC</dd></div>
        </dl>
        <h3>Block Transactions</h3>
        {tx.map( it => 
          <div className="tx fXS columns card bgDarkGray taLeft">
            <p className="layLV addr col11">Hash: {it.hash}</p>
            
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
                    <p className="btc">{SAT2BTC(item.prev_out.value)} BTC</p>
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
                <p className="btc"> {SAT2BTC(item.value)} BTC</p>
                <a href={item.addr ==="null"? "#":("https://www.blockchain.com/btc/address/"+item.addr)}>
                  {item.spent && <img className="inline" src={spent} title="Spent" alt="spent"/> }
                  {!item.spent && <img className="inline" src={unspent} title="Unspent" alt="unspent"/> }
                </a>
                </div>
              )}
              {/* <div className="cLightGreen taRight layLV">{ countOut(it.out) } BTC</div> */}
              </div>

            </div>
            <div className="cLightGreen layLV rows fxBetween">
              <p>Fee: {SAT2BTC(it.fee)} BTC</p>
              <p>{ countOut(it.out) } BTC</p>
            </div>
            <div className="feeverage">({fixed3(it.fee/it.size)} sat/byte - {fixed3(it.fee/it.weight)} sat/WU - {it.size} bytes)</div>
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

export default Explorer;
