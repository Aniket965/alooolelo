import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  PanResponder,
  Linking
} from "react-native";
import { ARKit, withProjectedPosition } from "react-native-arkit";
import Header from "./Header";
import { dataRef } from "./Constant";
var projectPosition = null;

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      anchor: null,
      modelTouchPoint: { x: 0, y: 0 },
      arPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      Selected: 1,
      SelectedColor: "#000000",
      isAroff: false,
      isSelected: false,
      data: null
    };

    this.ARPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderStart: (evt, gestureState) => {
        ARKit.hitTestSceneObjects({
          x: gestureState.x0,
          y: gestureState.y0
        }).then(res => {
          // console.log("Selected ")
          if (res.results.length > 0) {
            if (res.results[0].id.includes("$")) {
              this.setState({
                SelectedColor: res.results[0].id.substr(
                  1,
                  res.results[0].id.length
                )
              });
              this.forceUpdate();
            }
            this.setState({ isSelected: true });
          }
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.setState({
          modelTouchPoint: {
            x: gestureState.dx / 3840,
            y: gestureState.dy / 5120
          },
          arPosition: {
            x: this.state.arPosition.x + gestureState.dx / (3840 * 2),
            z: this.state.arPosition.z + gestureState.dy / (5120 * 2),
            y: this.state.arPosition.y
          }
        });
      },
      onPanResponderEnd: (evt, gestureState) => {
        ARKit.hitTestSceneObjects({
          x: gestureState.x0,
          y: gestureState.y0
        }).then(res => {
          // console.log(res);
          // return res.results.map(
          //   result => {
          //     if(result.id.startsWith('cursor')) {
          //       this.props.actions.changeModelPosition(result.position);
          //     }
          //   }
          // )
        });
      }
    });
  }

  componentWillMount() {
    dataRef.on("value", snapshot => {
      // let data = this.state.data;
      // data.push(snapshot.val());
      this.setState({
        data: snapshot.val()
      });

      console.log(snapshot.val());
    });
  }
  returnScaleFactor(id) {
    if (id === 1) {
      return 0.5;
    } else if (id === 2) {
      return 0.3;
    } else {
      return 0.7;
    }
  }

  returnModelName(id) {
    if (id === 1) {
      return "art.scnassets/shoe.dae";
    } else if (id === 2) {
      return "art.scnassets/sofa.dae";
    } else {
      return "art.scnassets/laptop.dae";
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.data ? (
          <View style={{ flex: 1 }}>
            <Header selected={this.state.data.data} />
            {this.state.isAroff ? (
              <View
                style={{
                  flex: 0.97,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 76,
                    textAlign: "center"
                  }}
                />
              </View>
            ) : (
              <ARKit
                style={{ flex: 0.97 }}
                // debug
                // enable plane detection (defaults to Horizontal)
                planeDetection={ARKit.ARPlaneDetection.Horizontal}
                // enable light estimation (defaults to true)
                lightEstimationEnabled
                // get the current lightEstimation (if enabled)
                // it fires rapidly, so better poll it from outside with
                // ARKit.getCurrentLightEstimation()
                // onLightEstimation={e => console.log(e.nativeEvent)}
                // event listener for (horizontal) plane detection
                onPlaneDetected={anchor => {
                  this.setState({ anchor, arPosition: anchor.position });
                }}
                // event listener for plane update
                onPlaneUpdated={anchor => {
                  if (!this.state.isSelected) {
                    console.log("Not Selected ");
                    this.setState({ anchor, arPosition: anchor.position });
                  }
                }}
                // // arkit sometimes removes detected planes
                // onPlaneRemoved={anchor => console.log(anchor)}
                // event listeners for all anchors, see [Planes and Anchors](#planes-and-anchors)
                // onAnchorDetected={anchor => console.log(anchor)}
                // onAnchorUpdated={anchor => console.log(anchor)}
                // onAnchorRemoved={anchor => console.log(anchor)}
                // you can detect images and will get an anchor for these images
                // detectionImages={[{ resourceGroupName: "DetectionImages" }]}
                onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
                {...this.ARPanResponder.panHandlers}
              >
                {this.state.anchor ? (
                  <ARKit.Group
                    position={this.state.arPosition}
                    transition={{ duration: 0.01 }}
                  >
                    {console.log(this.state.SelectedColor)}

                    {this.state.Selected === 1 ? (
                      <ARKit.Model
                        position={{ x: 0, y: 0, z: 0 }}
                        scale={this.returnScaleFactor(this.state.data.data)}
                        id="12"
                        // material={{
                        //   color: "#c6ab8d"
                        // }}
                        transition={{ duration: 0.01 }}
                        model={{
                          scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                          file: this.returnModelName(this.state.data.data)
                        }}
                      />
                    ) : null}
                    {this.state.Selected === 2 ? (
                      <ARKit.Model
                        position={{ x: 0, y: 0, z: 0 }}
                        scale={this.returnScaleFactor(this.state.data.data)}
                        material={{
                          color: "#47250f"
                        }}
                        transition={{ duration: 0.01 }}
                        model={{
                          scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                          file: this.returnModelName(this.state.data.data) // make sure you have the model file in the ios project
                        }}
                      />
                    ) : null}
                    {this.state.Selected === 3 ? (
                      <ARKit.Model
                        position={{ x: 0, y: 0, z: 0 }}
                        scale={this.returnScaleFactor(this.state.data.data)}
                        material={{
                          color: "#000000"
                        }}
                        transition={{ duration: 0.01 }}
                        model={{
                          scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                          file: this.returnModelName(this.state.data.data) // make sure you have the model file in the ios project
                        }}
                      />
                    ) : null}
                    <ARKit.Text
                      text={this.state.data.prices[this.state.Selected - 1]}
                      position={{ x: 0, y: 0.2, z: 0 }}
                      font={{ size: 0.05, depth: 0.01 }}
                    />
                  </ARKit.Group>
                ) : null}
              </ARKit>
            )}

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: this.state.Selected === 1 ? "white" : "black",
                  textAlign: "center",
                  marginLeft: 12,
                  paddingLeft: 12,
                  backgroundColor:
                    this.state.Selected === 1 ? "#0e74f9" : "white",
                  paddingRight: 12
                }}
                onPress={() => {
                  this.setState({ Selected: 1 });
                }}
              >
                1
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: this.state.Selected === 2 ? "white" : "black",
                  textAlign: "center",
                  marginLeft: 12,
                  paddingLeft: 12,
                  backgroundColor:
                    this.state.Selected === 2 ? "#0e74f9" : "white",
                  paddingRight: 12
                }}
                onPress={() => {
                  this.setState({ Selected: 2 });
                }}
              >
                2
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: this.state.Selected === 3 ? "white" : "black",
                  textAlign: "center",
                  marginLeft: 12,
                  paddingLeft: 12,
                  backgroundColor:
                    this.state.Selected === 3 ? "#0e74f9" : "white",
                  paddingRight: 12
                }}
                onPress={() => {
                  this.setState({ Selected: 3 });
                }}
              >
                3
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: !this.state.isAroff ? "white" : "black",
                  textAlign: "center",
                  marginLeft: 56,
                  paddingLeft: 12,
                  backgroundColor: !this.state.isAroff ? "#0e74f9" : "white",
                  paddingRight: 12
                }}
                onPress={() => {
                  this.setState({ isAroff: !this.state.isAroff });
                }}
              >
                AR
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "center",
                  marginLeft: 64,
                  paddingLeft: 12,
                  paddingRight: 12
                }}
              >
                {this.state.data.name}
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "center",
                  marginLeft: 36,
                  paddingLeft: 12,
                  paddingRight: 12,
                  backgroundColor: "#f9c60e"
                }}
                onPress={() => {
                  Linking.openURL(
                    this.state.data.links[this.state.Selected - 1]
                  ).catch(err => console.error("An error occurred", err));
                }}
              >
                BUY NOW
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex"
            }}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 76,
                textAlign: "center"
              }}
            />
          </View>
        )}
      </View>
    );
  }
}
