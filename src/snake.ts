import { Vector } from "./types";

class Snake {
  private initialState: Array<Vector> = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ];
  private state: Array<Vector> = this.initialState;

  constructor(state?: Array<Vector>) {
    this.state = state || this.initialState;
  }

  getCurrentState() {
    return [...this.state];
  }

  getLength() {
    return this.state.length;
  }

  updateState(state: Array<Vector>) {
    this.state = state;
  }

  sliceSnek(biteVector: Vector) {
    const biteIndex = this.state.findIndex(
      (vec) => vec.y === biteVector.y && vec.x === biteVector.x
    );
    const removedBody = this.state.slice(0, biteIndex + 1);
    this.state = this.state.slice(biteIndex + 1);
    return removedBody;
  }

  getCurrentHead() {
    if (!this.state[this.getLength() - 1]) debugger;
    return this.state[this.getLength() - 1];
  }
}

export default Snake;
