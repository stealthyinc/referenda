import React from 'react';
import { View } from 'react-native';
import {
  RkComponent,
  RkText,
  RkTheme,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { VictoryPie } from 'victory-native';
import { Svg, Text as SvgText } from 'react-native-svg';
import { scale } from '../../Utils/scale';

export class GuaidoDonutChart extends RkComponent {
  state = {
    selected: 0,
    data: [
      {
        x: 1,
        y: 360,
        title: '62%',
        name: 'Guaido',
        color: 'blue',
      },
      {
        x: 2,
        y: .38*360,
        title: '38%',
        name: 'Maduro',
        color: 'gold',
      }
    ],
  };
  size = 300;
  fontSize = 40;

  computeColors = () => this.state.data.map(i => i.color);

  onPeopleChartPressed = (event, props) => {
    this.setState({
      selected: props.index,
    });
  };

  renderMarkdown = () => this.state.data.map(this.renderMarkdownItem);

  renderMarkdownItem = (item) => (
    <View key={item.name} style={styles.legendItem}>
      <View style={[styles.itemBadge, { backgroundColor: item.color }]} />
      <RkText rkType="primary3">{item.name}</RkText>
    </View>
  );

  render = () => (
    <View>
      <View style={{ alignSelf: 'center' }}>
        <Svg width={scale(this.size)} height={scale(this.size)}>
          <VictoryPie
            labels={[]}
            width={scale(this.size)}
            height={scale(this.size)}
            colorScale={this.computeColors()}
            data={this.state.data}
            standalone={false}
            padding={scale(25)}
            innerRadius={scale(70)}
            events={[{
              target: 'data',
              eventHandlers: {
                onPressIn: this.onPeopleChartPressed,
              },
            }]}
          />
          <SvgText
            textAnchor="middle"
            verticalAnchor="middle"
            x={scale(this.size / 2)}
            y={scale(this.size / 2)}
            height={scale(this.fontSize)}
            fontSize={scale(this.fontSize)}
            fontFamily={RkTheme.current.fonts.family.regular}
            stroke='black'
            fill={this.state.data[this.state.selected].color}>
            {this.state.data[this.state.selected].title}
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = RkStyleSheet.create(() => ({
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
}));
