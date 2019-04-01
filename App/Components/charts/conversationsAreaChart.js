import React from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import {
  RkComponent,
  RkTheme,
  RkText,
} from 'react-native-ui-kitten';

import {
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
  VictoryGroup,
} from 'victory-native';


export class ConversationsAreaChart extends RkComponent {
  // state = {
  //   data: [
  //     { x: 1, y: 66 },
  //     { x: 2, y: 66 },
  //     { x: 3, y: 66 },
  //     { x: 4, y: 66 },
  //     { x: 5, y: 66 },
  //     { x: 6, y: 66 },
  //     { x: 7, y: 66 },
  //     { x: 8, y: 66 },
  //     { x: 9, y: 66 },
  //     { x: 10, y: 66 },
  //   ],
  // };

  constructor(props) {
    super()

    const anInitValue = props.initValue
    this.state = {
      data: []
    }

    for (let i = 1; i <= 10; i++ ) {
      this.state.data.push({x: i, y: anInitValue})
    }
  }

  componentWillMount() {
    this.size = Dimensions.get('window').width;
  }

  componentDidMount() {
    this.setStateInterval = setInterval(() => {
      const randNum = Math.random()
      const increment = randNum > 0.50;
      const tenPlus = randNum > 0.9;

      let newValue = this.state.data[this.state.data.length - 1].y;
      if (increment) {
        let value = Math.ceil(Math.random() * 3)
        if (tenPlus) {
          value += 10
        }
        newValue += value
      }

      const newData = this.state.data.map((d, i) => ({
        x: d.x,
        y: i === this.state.data.length - 1 ? newValue : this.state.data[i + 1].y,
      }));

      this.setState({
        data: newData,
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.setStateInterval);
  }

  render = () => (
    <View>
      <RkText rkType='medium' style={{color:'#FFFFFF'}}>Team Conversations Today</RkText>
      <VictoryChart
        padding={{
            top: 20, left: 40, right: 5, bottom: 5,
          }}
        width={this.size - 60}>
        <VictoryAxis
          tickValues={[]}
          style={{
              axis: { stroke: 'transparent' },
            }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={[0, 100, 200, 300]}
          style={{
              axis: { stroke: 'transparent' },
              grid: { stroke: RkTheme.current.colors.disabled, strokeWidth: 0.5 },
              tickLabels: {
                fontSize: 14,
                stroke: RkTheme.current.colors.text.secondary,
                fill: RkTheme.current.colors.text.secondary,
                fontFamily: RkTheme.current.fonts.family.regular,
                strokeWidth: 0.5,
              },
            }}
        />
        <VictoryGroup data={this.state.data}>
          <VictoryArea
            style={{
                data: {
                  fill: RkTheme.current.colors.charts.area.fill,
                  fillOpacity: 0.5,
                  stroke: RkTheme.current.colors.charts.area.stroke,
                  strokeOpacity: 0.8,
                  strokeWidth: 1.5,
                },
              }}
          />
          <VictoryScatter
            style={{
                data: {
                  fill: 'white',
                  stroke: RkTheme.current.colors.charts.area.stroke,
                  strokeOpacity: 0.8,
                  strokeWidth: 1.5,
                },
              }}
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
}
