import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';

function App() {
  const [manager, setManager] = useState(0);
  const [players, setPlayers] = useState(0);
  const [lotterySum, setLotterySum] = useState(0);
  const [amountToEnter, setAmountToEnter] = useState(0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    async function init() {
      const manager = await lottery.methods.manager().call();
      setManager(manager)

      const players = await lottery.methods.getPlayers().call();
      setPlayers(players)

      let lotterySum = await web3.eth.getBalance(lottery.options.address);
      lotterySum = web3.utils.fromWei(lotterySum, 'ether')
      setLotterySum(lotterySum)
    }
    init()
  });


  async function enterLottery(event) {
    event.preventDefault();
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts);
    setMessage('Waiting on transaction success...')
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amountToEnter, 'ether')
    })
    setMessage('You have been entered!');
    setAmountToEnter(0)
  }

  async function pickWinner() {
    const accounts = await web3.eth.requestAccounts();
    setMessage('Waiting on transaction success...')
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    let winner = await lottery.methods.winner().call();
    if(winner){
      setMessage(`${winner} won the lottery!`);
      setAmountToEnter(0)
    }
  }
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}.
        There are currently {players.length} people entered,
        competing to win {lotterySum} Ether!
      </p>

      <hr />

      <form>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value={amountToEnter} onChange={(e) => setAmountToEnter(e.target.value)}></input>
        </div>
        <button onClick={enterLottery}>Enter</button>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner!</button>

      <hr />

      <h1>{message}</h1>



    </div>
  );
}

export default App;
