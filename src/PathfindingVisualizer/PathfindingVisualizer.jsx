import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
let FINISH_ANIMATION_FLAG = false;
let  PREV_ANIMATION_FLAG = false;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          if(nodesInShortestPathOrder.length == 1)
          {
            alert("target node not found");
            return;
          }
          console.log(nodesInShortestPathOrder.length);
          this.animateShortestPath(nodesInShortestPathOrder);
          
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        
      }, 10 * i);
      setTimeout(function(){
        setTimeout(() => {
          const first_node = nodesInShortestPathOrder[0];
          document.getElementById(`node-${first_node.row}-${first_node.col}`).classList.remove('node-visited');
          document.getElementById(`node-${first_node.row}-${first_node.col}`).classList.add('node-start');
          const last_node = nodesInShortestPathOrder[nodesInShortestPathOrder.length-1];
          document.getElementById(`node-${last_node.row}-${last_node.col}`).classList.remove('node-visited');
          document.getElementById(`node-${last_node.row}-${last_node.col}`).classList.add('node-finish');
        }, 50*i)
          
        
      }, 10)
    }
    
  }
  animation_end_popup(){
    console.log("Hello");
  }
  animateShortestPath(nodesInShortestPathOrder) {
    document.querySelector("h3").style.opacity = '1';
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-end-animation';
      }, 60 * i);
    }
    setTimeout(function() {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
          const first_node = nodesInShortestPathOrder[0];
          document.getElementById(`node-${first_node.row}-${first_node.col}`).classList.remove('node-shortest-path');
          document.getElementById(`node-${first_node.row}-${first_node.col}`).classList.add('node-start');
          const last_node = nodesInShortestPathOrder[nodesInShortestPathOrder.length-1];
          document.getElementById(`node-${last_node.row}-${last_node.col}`).classList.remove('node-shortest-path');
          document.getElementById(`node-${last_node.row}-${last_node.col}`).classList.add('node-finish');
          document.getElementById(`node-${last_node.row}-${last_node.col}`).classList.add('node-finished');
        }, 60 * i);
      }
    }, 10)

    //to add some message after the animation has finished.
    // FINISH_ANIMATION_FLAG = true;
    // if(FINISH_ANIMATION_FLAG)
    // {
    //   alert("");
    // }
  }
  
  resetBoard()
  {
    window.location.reload();
  }
  

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    PREV_ANIMATION_FLAG = true;
  }

  
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.resetBoard()}>
          Reset
        </button>
        <h3>Target Node found!!</h3>
        <div className="wrapper">
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx} className="grid-node">
                  {row.map((node, nodeIdx) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
