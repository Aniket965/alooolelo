import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  PanResponder
} from "react-native";
import { ARKit, withProjectedPosition } from "react-native-arkit";
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
      SelectedColor:"white",
      isSelected: false
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

            if(res.results[0].id.includes("$")) {

              this.setState({SelectedColor:res.results[0].id.substr(1,res.results[0].id.length)})
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
  // constructor() {
  //   super();
  //   this.state = {
  //     anchor: null
  //   };
  // }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
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
              <ARKit.Sphere
                position={{ x: 0, y: 0, z: 0.0 }}
                transition={{ duration: 0.01 }}
                shape={{ radius: 0.05 }}
                material={{ diffuse: this.state.SelectedColor }}
              />
              <ARKit.Box
                position={{ x: 0.12, y: 0, z: 0.0 }}
                material={{ diffuse: "blue" }}
                id="$blue"
                shape={{
                  width: 0.05,
                  length: 0.05,
                  height: 0.05,
                  chamfer: 0.01
                }}
                transition={{ duration: 1 }}
              />
              <ARKit.Box
                id="$red"
                position={{ x: 0, y: 0, z: 0.12 }}
                material={{ diffuse: "red" }}
                shape={{
                  width: 0.05,
                  length: 0.05,
                  height: 0.05,
                  chamfer: 0.01
                }}
                transition={{ duration: 1 }}
              />
              <ARKit.Box
                id="$green"
                position={{ x: -0.12, y: 0, z: 0 }}
                material={{ diffuse: "green" }}
                shape={{
                  width: 0.05,
                  length: 0.05,
                  height: 0.05,
                  chamfer: 0.01
                }}
                transition={{ duration: 1 }}
              />
            </ARKit.Group>
          ) : null}
        </ARKit>
      </View>
    );
  }
}
