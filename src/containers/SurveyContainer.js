import React from "react";
import _ from 'lodash';
import { VictoryChart, VictoryScatter } from "victory-native";

function getRandom(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min)
}

export default class Survey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scatterData: this.getScatterData()
    };
  }
  componentDidMount() {
    this.setStateInterval = window.setInterval(() => {
      this.setState({
        scatterData: this.getScatterData()
      });
    }, 3000);
  }
  componentWillUnmount() {
    window.clearInterval(this.setStateInterval);
  }
  getScatterData() {
    const colors =[
      "violet", "cornflowerblue", "gold", "orange",
      "turquoise", "tomato", "greenyellow"
    ];
    const symbols = [
      "circle", "star", "square", "triangleUp",
      "triangleDown", "diamond", "plus"
    ];
    return _.range(25).map((index) => {
      const scaledIndex = Math.floor(index % 7);
      return {
        x: getRandom(10, 50),
        y: getRandom(2, 100),
        size: getRandom(8) + 3,
        symbol: symbols[scaledIndex],
        fill: colors[getRandom(0, 6)],
        opacity: 1
      };
    });
  }
  render() {
    return (
      <VictoryChart animate={{ duration: 2000, easing: "bounce" }}>
        <VictoryScatter
          data={this.state.scatterData}
          style={{
            data: {
              fill: (d) => d.fill,
              opacity: (d) => d.opacity
            }
          }}
        />
      </VictoryChart>
    );
  }
}
