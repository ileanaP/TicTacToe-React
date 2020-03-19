import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';

/*class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
      return (
        <button 
            className="square" 
            onClick = { () => this.props.onClick() }>
          {this.props.value}
        </button>
      );
    }
  }*/

  function Square(props) {
      return (

          <button className = {props.cls}
                  onClick = {props.onClick}>
                      {props.value}
                  </button>
      );
  }

  function NewGame(props){
    return(
      <button className = "winner-results new-game mt-15"
              onClick = {props.onClick}>
        New Game
      </button>
    );
  }

  function TextWithBold(props){
    return(
      <p>
        Next player: <strong class="green-text">{props.value}</strong> 
        <span class="text-with-bold-span">(<a href="#" onClick={props.onClick}>change who starts)</a></span>
      </p>
    );
  }

  function Score(props){
    return(
      <p>
        <div class="float-left">
            <strong class="orange-text"> X : {props.xscore}</strong>
        </div>
        <div class="float-left">
            <strong class="orange-text"> O : {props.yscore}</strong>
        </div>
        <div class="float-left">
        <button className="winner-results new-game"
                onClick = {props.onClick}>
        Reset Score
      </button>
      </div>
      <div style={{clear: "both"}}></div>
      </p>
    );
  }
  
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(''),
            squareClasses: Array(9).fill(''),
            newValue: 'X',
            winVal: '',
            completed: 0,
            xscore: 0,
            yscore: 0,
            //justTest: ''
        };
    }

    resetScore() {

      if(!this.canClose())
        return;

      this.handleNewGame();

      this.setState({
            xscore: 0,
            yscore: 0
      });
    }

    handleClick(i) {
        if (this.state.winVal != '')
            return;

        const squares = this.state.squares.slice();
        if (squares[i] != '')
            return;

        var newValue = this.state.newValue;
        var winVal = this.state.winVal;
        var newClasses = this.state.squareClasses.slice();
        var xscore = this.state.xscore;
        var yscore = this.state.yscore;

        squares[i] = newValue;

        var bgLn = parseInt(i/3)*3;
        var forC = i%3;

        var line = '', column = '', firstDiag = '', secDiag = '';

        line   = squares[bgLn] + squares[bgLn+1] + squares[bgLn+2];
        column = squares[forC] + squares[forC+3] + squares[forC+6];

        if (i%4 == 0)
            firstDiag = squares[0] + squares[4] + squares[8];
        else if (i%2 == 0)
            secDiag = squares[2] + squares[4] + squares[6];
        
        var dVal = newValue.repeat(3);

        var winns;

        switch(dVal)
        {
            case line:
                    winns = [bgLn, bgLn+1, bgLn+2];
                    break;
            case column:
                    winns = [forC, forC+3, forC+6];
                    break;
            case firstDiag:
                    winns = [0, 4, 8];
                    break;
            case secDiag:
                    winns = [2, 4, 6];
                    break;
            default: break;
        }

        var completed = this.state.completed + 1;

        if (typeof winns != "undefined")
        {
            winns.forEach(e => newClasses[e] = 'active')
            winVal = newValue;

            if(newValue == 'X')
              xscore += 1;
            else
              yscore += 1;
        }
        else if (completed == 9)
                winVal = 'No Winner, try again';

        newValue = newValue == 'O' ? 'X' : 'O';

        this.setState({
          squares: squares, 
          newValue: newValue, 
          completed: completed, 
          squareClasses: newClasses, 
          winVal: winVal,
          xscore: xscore,
          yscore: yscore
        });
    }

    handleNewGame() {
      this.setState({
        squares       : Array(9).fill(''), 
        squareClasses : Array(9).fill(''),
        newValue      : 'X',
        winVal        : '',
        completed     : 0
      });
    }

    canClose() {
        if(this.state.winVal != '')
          return true;

        var retVal = true;

        const squares = this.state.squares.slice();

        var nrElms = 0;
        squares.forEach(e => nrElms = e != '' ? nrElms + 1 : nrElms);
        
        const conf = "Are you sure? A game is in progress.";

        if(nrElms != 0)
        {
          if(window.confirm(conf))
            retVal = true;
          else
            retVal = false;
        }

        return retVal;
    }

    changeWhoStarts() {

        if(!this.canClose())
          return;

        var newValue = this.state.newValue == 'X' ? 'O' : 'X';

        this.handleNewGame()

        this.setState({
            newValue: newValue
        });
    }

    renderSquare(i, cls) {
      return <Square 
                value = { this.state.squares[i] }
                onClick = { () => this.handleClick(i) }
                cls = { "square" + (cls != '' ? " " + "square-"+cls : '') }
            />;
    }

    renderNewGame() {
      return <NewGame 
                onClick = { () => this.handleNewGame() }
            />
    }

    renderScore(xscore, yscore) {
      return <Score 
                  xscore = { xscore }
                  yscore = { yscore }
                  onClick = { () => this.resetScore() }
            />
    }
  
    render() {
      const winVal = this.state.winVal;
      var winRes =  '', newGame = '', status = '';

      if(winVal != '')
      {
        winRes  = "Winner is... : " + winVal;
        newGame = this.renderNewGame();

        status =  <p className="sweet" children="Game is finished."/>;
      }
      else
      {
        status = <TextWithBold 
                    value = { this.state.newValue } 
                    onClick = { () => this.changeWhoStarts() } />
      }

      return (
        <div>
          {/* {this.state.justTest} */}
          {this.renderScore(this.state.xscore, this.state.yscore)}
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0, this.state.squareClasses[0])}
            {this.renderSquare(1, this.state.squareClasses[1])}
            {this.renderSquare(2, this.state.squareClasses[2])}
          </div>
          <div className="board-row">
            {this.renderSquare(3, this.state.squareClasses[3])}
            {this.renderSquare(4, this.state.squareClasses[4])}
            {this.renderSquare(5, this.state.squareClasses[5])}
          </div>
          <div className="board-row">
            {this.renderSquare(6, this.state.squareClasses[6])}
            {this.renderSquare(7, this.state.squareClasses[7])}
            {this.renderSquare(8, this.state.squareClasses[8])}
          </div>

          <div className="winner-results mt-15"> {winRes} </div>

          {newGame}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
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
  