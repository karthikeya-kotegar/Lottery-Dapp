import logo from './logo.svg';
import './App.css';
import { React, Component } from 'react';
import web3 from './web3';
import lottery from './lottery';
class App extends Component {

  // constructor(props) {
  //   super(props);
  //   // declare state. 
  //   this.state = { manager: ''};
  // }
  // OR
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  // method is automatically called when component rendered first time.
  async componentDidMount(){
    // get the manager address from lottery contract.
    const manager = await lottery.methods.manager().call();
    // call the getplayers() from the lottery contract.
    const players = await lottery.methods.getPlayers().call();
    // get the balance of the account.
    const balance = await web3.eth.getBalance(lottery.options.address);
    // set the  state
    this.setState({ manager, players, balance });
  }

  // on clicking the enter form button
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    this.setState({ message: "waiting for transaction ...please hold on!"})
    // this will take some time
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    // after the execution of enter call
    this.setState({message: "You have been entered...Welcome!"})
  }

  onClick = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Picking... please hold on'})

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message: 'Winner has been picked!'});
  }

  render() {
    // get the web3 version
    // console.log("web3", web3.version);
    // log  all the accounts connected to web3(app).
    // web3.eth.getAccounts().then(console.log);

  return (
    <div>
      <h2>Lottert Contract</h2>
      <p>This contrat is managed by {this.state.manager}.</p>
      <p>
        There  are currently {this.state.players.length} people entered! competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ethers.
      </p>
      <hr />
      {/* form to enter */}
      <form onSubmit={this.onSubmit}>
        <h4>Want to try your luck!</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input 
          value = {this.state.value}
          onChange = {event => this.setState({value: event.target.value })} />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to see the winner?</h4>
      <button onClick= {this.onClick} >Pick a winner</button>
      <hr />
      <h1>{this.state.message}</h1>

    </div>
  );
  }
}

export default App;
