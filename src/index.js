import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const className = `square ${props.win ? "win" : ""}`;
  return (
    <button id={props.id} className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const winLine = props.winLine;
  const completeBoard = [];
  for (let rows = 0; rows < 3; rows++) {
    const boardCols = [];
    for (let cols = 0; cols < 3; cols++) {
      const areaValue = () => {
        if (rows === 0) {
          return cols;
        }
        if (rows === 1) {
          return rows + cols + 2;
        }
        return rows + cols + 4;
      };
      boardCols.push(
        <Square
          key={cols}
          id={cols}
          value={props.squares[areaValue()]}
          onClick={() => props.onClick(areaValue())}
          win={winLine && winLine.includes(areaValue())}
        />
      );
    }

    completeBoard.push(
      <div key={rows} id={rows} className="board-row">
        {boardCols}
      </div>
    );
  }

  return <div>{completeBoard}</div>;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      cO: {},
      isAscending: true,
    };
  }

  setCoOrdinates(squarePosition) {
    switch (squarePosition) {
      case 0:
        return { column: 1, row: 1 };
      case 1:
        return { column: 2, row: 1 };
      case 2:
        return { column: 3, row: 1 };
      case 3:
        return { column: 1, row: 2 };
      case 4:
        return { column: 2, row: 2 };
      case 5:
        return { column: 3, row: 2 };
      case 6:
        return { column: 1, row: 3 };
      case 7:
        return { column: 2, row: 3 };
      case 8:
        return { column: 3, row: 3 };
      default:
        return;
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winPlayer || squares[i]) {
      return;
    }

    squares[[i]] = this.state.xIsNext ? "X" : "O";
    const coOrdinates = this.setCoOrdinates(i);
    this.setState({
      history: history.concat([
        {
          squares: squares,
          cO: coOrdinates,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moves: [],
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const coordinates = this.state.history;

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " C:" +
          coordinates[move].cO.column +
          " R:" +
          coordinates[move].cO.row
        : "Go to game beginning";
      return (
        <li key={move}>
          <button
            className={current === history[move] ? "activeButton" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    const isAscending = this.state.isAscending;

    if (!isAscending) {
      moves.reverse();
    }

    const isEndOfMove = current.squares.some((square) => square === null);

    let status;
    if (winner.winPlayer) {
      status = "Win player: " + winner.winPlayer;
    }
    if (!isEndOfMove && !winner.winPlayer) {
      status = "The result is draw!";
      alert("The game ending by draw!");
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winner.winLine}
          />
          <button
            className={`restartButton ${
              winner.winPlayer || isEndOfMove === false ? "" : "hide"
            }`}
            onClick={() => window.location.reload()}
          >
            Play again!
          </button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              className="sortButton"
              onClick={() => this.handleSortToggle()}
            >
              {isAscending ? "Sort descending" : "Sort ascending"}
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return { winPlayer: squares[a], winLine: lines[i] };
    }
  }
  return { winPlayer: null, winLine: null };
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
