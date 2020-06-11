//TODO See more challenges for improvements here: https://reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }
  createBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let rows = [];
      rows.push(i + 1)
      for (let j = 0; j < 3; j++) {
        rows.push(this.renderSquare(j + (3 * i)))
      }
      board.push(<div className="board-row">{rows}</div>)
    }
    console.log("board:" + board);
    return board;
  }
  render() {
    return (
      <div>
        Column
        <br></br>
        <div className="column-header">1 2 3</div>
        <br></br>
        {this.createBoard()}
      </div>
    );
  }


}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      coordinates: [{
        coord: Array(2).fill(null),
      }],
    };
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const coordinates = this.state.coordinates[move];
      let desc = move ?
        'Go to move #' + move + " coordinates: " + coordinates.coord :
        'Go to game start';
      const shouldBold = (move === this.state.stepNumber);
      console.log("MOVE move:" + move + "this.state.stepNumber:" + this.state.stepNumber);
      return (
        <li key={move}>
          <button className={shouldBold ? 'bold-button' : null} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>Moves are displayed in the format (col,row)</div>
      </div>
    );
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const coordinates = this.state.coordinates.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //here we get i
    let coord = getCoordinates(i);
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      coordinates: coordinates.concat([{
        coord: coord,
      }]),
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getCoordinates(cell) {
  let x = 0;
  let y = 0;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ]
  for (let i = 0; i < lines.length; i++) {
    let index = lines[i].indexOf(cell);
    if (index >= 0) {
      y = i + 1;
      x = index + 1;
    }
  }
  console.log("MIGUEL2 x:" + x + "y:" + y);
  return [x, y];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}