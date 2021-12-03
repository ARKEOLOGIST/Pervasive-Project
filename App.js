/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { thisExpression, throwStatement } from '@babel/types';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ToastAndroid,
  Dimensions,
  TouchableHighlight
} from 'react-native';
import {
  LineChart
} from "react-native-chart-kit";

 class App extends Component {
   constructor() {
     super();
     this.state = {
       readings: [],
       Temp: [0.00,0.00],
       Press: [0.00,0.00],
       Humid: [0.00,0.00],
       Time: [0.00,0.00],
       Alt: [0.00,0.00],
       Gas: [0.00,0.00],
       counter: 5,
       type: 1,
       mean: 0,
       median: 0,
       visible: 0
     }
   }

  async componentDidMount() {
    fetch(`https://mw6gyikpy5.execute-api.us-west-2.amazonaws.com/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then((json) => {
      this.setState({ readings: [...this.state.readings,json] })
      this.state.readings.map((e) => { 
          var Press_1 = [];
          var Humid_1 = [];
          var Temp_1 = [];
          var Gas_1 = [];
          var Alt_1 = [];
          var Time_1 = [];
          var sport = 0;
        e.map((a) => {
          Press_1.push(parseFloat(a.Pressure.toFixed(2)));
          Humid_1.push(parseFloat(a.humidity.toFixed(2)));
          Temp_1.push(parseFloat(a.temperature.toFixed(2)));
          Gas_1.push(parseFloat(a.gas.toFixed(2)));
          Alt_1.push(parseFloat(a.Altitude.toFixed(2)));
          Time_1.push(sport.toString());
          sport += 5;
        });
        this.setState({
          Temp: Temp_1,
          Press: Press_1,
          Humid: Humid_1,
          Gas: Gas_1,
          Alt: Alt_1,
          Time: Time_1,
          counter: sport
        });       
      })
    }).catch((err) => {ToastAndroid.show(""+err,ToastAndroid.SHORT)});
    /*try {
    setInterval(async () => {
      var arr_Temp;
      var arr_Press;
      var arr_Humid;
      var arr_Time;
      fetch(`http://10.30.9.65:5000/request`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then((json) => {
        arr_Temp = [...this.state.Temp];
        arr_Press = [...this.state.Press];
        arr_Humid = [...this.state.Humid]
        arr_Time = [...this.state.Time];
        if (arr_Temp.length == 10 || arr_Time.length == 10 || arr_Press.length == 10 || arr_Humid.length == 10) 
      {
        arr_BPM.shift();
        arr_Time.shift();
      }
      this.setState({ readings: [...this.state.readings,json],SpO2: [...this.state.SpO2,parseInt(json.SpO2)],BPM: [...arr_BPM,parseInt(json.BPM)],Temp: [...this.state.Temp,parseInt(json.Temp)],Time: [...arr_Time,this.state.counter.toString()],counter: this.state.counter+5 })
    }).catch((err) => {ToastAndroid.show(""+err,ToastAndroid.SHORT)});
  }, 5000);
} catch(err) {ToastAndroid.show(""+err,ToastAndroid.SHORT)}*/
  }

  calculateMM() {
    var arr = [];
    if (this.state.type == 1)
    {
      arr = [...this.state.Temp];
    }
    else if (this.state.type == 2)
    {
      arr = [...this.state.Press];
    }
    else if (this.state.type == 3)
    {
      arr = [...this.state.Humid];
    }
    else if (this.state.type == 4)
    {
      arr = [...this.state.Alt];
    }
    else
    {
      arr = [...this.state.Gas];
    }
    var l = arr.length-1;
    var mean_1 = 0;
    while (l >= 0)
    {
      mean_1 += arr[l];
      l--;
    }
    l = arr.length;
    mean_1 /= l;
    arr.sort();
    var median_1 = 0;
    if (arr.length%2 == 0)
    {
      median_1 = (arr[l/2]+arr[(l/2)+1])/2;
    }
    else
    {
      median_1 = arr[l+1/2];
    }
    this.setState({
      visible: 1,
      mean: mean_1,
      median: median_1,
    });
  }

  renderSwitch(param) {
    switch(param) {
      case 1 :  return "Temperature"
                break;
      case 2 :  return "Pressure"
                break;
      case 3 :  return "Humidity"
                break;
      case 4 :  return "Gas"
                break;
      case 5 :  return "Altitude"
                break;
    }
  }

  render()
   {
    return (
      <View style={styles.center}>
      {Object.keys(this.state.readings).length != 0?<Text style={{ fontSize: 25 }}>{this.renderSwitch(this.state.type)}</Text>:<Text>&nbsp;</Text>}
        {Object.keys(this.state.readings).length != 0?
          <View>
          <LineChart
        data={{
          labels: this.state.Time,
          datasets: [
            {
              data: this.state.type==1?this.state.Temp:this.state.type==2?this.state.Press:this.state.type==3?this.state.Humid:this.state.type==4?this.state.Gas:this.state.Alt
            }
          ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        xAxisLabel=" s"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          },
          propsForHorizontalLabels: {
            originX: this.state.counter
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
      {this.state.visible==1?<View style={{flexDirection: "column"}}>
      <Text style={{ textAlign: "center" }}>Mean: <Text>{this.state.mean}</Text></Text>
      <Text style = {{ textAlign: "center" }}>Median: <Text>{this.state.median}</Text></Text>
      </View>:<View></View>}
      <View style={{ marginTop: 300,flexDirection: "row"}}>
      <TouchableHighlight style={this.state.type==1?styles.activebutton:styles.button} onPress={() => {this.setState({ type: 1,visible: 0 })}}><Text style={styles.text}>Temperature</Text></TouchableHighlight>
      <TouchableHighlight style={this.state.type==2?styles.activebutton:styles.button} onPress={() => {this.setState({ type: 2,visible: 0 })}}><Text style={styles.text}>Pressure</Text></TouchableHighlight>
      <TouchableHighlight style={this.state.type==3?styles.activebutton:styles.button} onPress={() => {this.setState({ type: 3,visible: 0 })}}><Text style={styles.text}>Humidity</Text></TouchableHighlight>
      <TouchableHighlight style={this.state.type==4?styles.activebutton:styles.button} onPress={() => {this.setState({ type: 4,visible: 0 })}}><Text style={styles.text}>Gas</Text></TouchableHighlight>
      <TouchableHighlight style={this.state.type==5?styles.activebutton:styles.button} onPress={() => {this.setState({ type: 5,visible: 0 })}}><Text style={styles.text}>Altitude</Text></TouchableHighlight>
      </View>
      <View style={{ marginTop: '10%' }}>
      <TouchableHighlight style={{ alignItems: 'center',height: 50,justifyContent: 'center'}} onPress={this.calculateMM.bind(this)}><Text>Get Stats!</Text></TouchableHighlight>
      </View>
      </View>
        :<Text style={{ fontSize: 45 }}>Welcome!</Text>}
      </View>
    );
   } 
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    backgroundColor: "#A0EE52",
    height: 100
  },
  activebutton: {
    flex: 1,
    backgroundColor: "green",
    height: 100
  },
  text: {
    textAlign: "center",
    marginTop: "25%",
    color: "white",
    fontSize: 16
  }
});

export default App;
