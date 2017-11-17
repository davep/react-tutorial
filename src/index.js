import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square( props ) {
    return (
        <button className="square" onClick={ () => props.onClick() }>
          {props.value}
        </button>
    );
}

function Row( props ) {

    const fromTo = ( low, high ) => Array( high + 1 ).fill( 0 ).map( ( _, i ) => i ).slice( low, high + 1 );

    return (
        <div className="board-row">
          {fromTo( props.from, props.to).map( i => <Square value={props.squares[ i ]} onClick={() => props.onClick( i )} />)}
        </div>
    );
}

function Board( props ) {
    return (
        <div>
          <Row from={0} to={2} squares={props.squares} onClick={props.onClick} />
          <Row from={3} to={5} squares={props.squares} onClick={props.onClick} />
          <Row from={6} to={8} squares={props.squares} onClick={props.onClick} />
        </div>
    );
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [ {
                squares: Array(9).fill( null )
            } ],
            xIsNext: true,
            stepNumber: 0
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[ history.length - 1 ];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[ this.state.stepNumber ];
        const winner  = calculateWinner( current.squares );

        const moves = history.map((step, move) => {
            const desc = move ?
                  'Go to move #' + move :
                  'Go to game start';
            return (
                <li key={move}>
                  <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + ( this.state.xIsNext ? 'X' : 'O' );
        }

        return (
            <div className="game">
              <div className="game-board">
                <Board squares={current.squares} onClick={( i ) => this.handleClick( i )}/>
              </div>
              <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
              </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
