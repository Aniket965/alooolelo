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
      SelectedColor: "#000000",
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
              {/* <ARKit.Sphere
                position={{ x: 0, y: 0, z: 0.0 }}
                transition={{ duration: 0.01 }}
                shape={{ radius: 0.05 }}
                material={{ diffuse: this.state.SelectedColor }}
              /> */}

              {console.log(this.state.SelectedColor)}

              {this.state.SelectedColor === "#c6ab8d" ? (
                <ARKit.Model
                  position={{ x: 0, y: 0, z: 0 }}
                  scale={0.1}
                  id="12"
                  material={{
                    color: "#c6ab8d"
                  }}
                  transition={{ duration: 0.01 }}
                  model={{
                    scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                    file: "art.scnassets/sofa.dae" // make sure you have the model file in the ios project
                  }}
                />
              ) : null}
              {this.state.SelectedColor === "#000000" ? (
                <ARKit.Model
                  position={{ x: 0, y: 0, z: 0 }}
                  scale={0.1}
                  material={{
                    color: "#00000"
                  }}
                  transition={{ duration: 0.01 }}
                  model={{
                    scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                    file: "art.scnassets/sofa.dae" // make sure you have the model file in the ios project
                  }}
                />
              ) : null}
              {this.state.SelectedColor === "#3d0f82" ? (
                <ARKit.Model
                  position={{ x: 0, y: 0, z: 0 }}
                  scale={0.1}
                  material={{
                    color: "#3d0f82"
                  }}
                  transition={{ duration: 0.01 }}
                  model={{
                    scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                    file: "art.scnassets/sofa.dae" // make sure you have the model file in the ios project
                  }}
                />
              ) : null}
              <ARKit.Box
                position={{ x: 0.15, y: 0, z: 0.0 }}
                material={{ diffuse: "#c6ab8d" }}
                id="$#c6ab8d"
                shape={{
                  width: 0.05,
                  length: 0.05,
                  height: 0.05,
                  chamfer: 0.01
                }}
                transition={{ duration: 1 }}
              />
              <ARKit.Box
                id="$#000000"
                position={{ x: 0, y: 0, z: 0.15 }}
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
                id="$#3d0f82"
                position={{ x: -0.15, y: 0, z: 0 }}
                material={{ diffuse: "#3d0f82" }}
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
        <View style={{ height: 36 }}>
          <Text
            style={{ fontSize: 36, fontWeight: "bold", textAlign: "center" }}
          >
            Sofa
          </Text>
        </View>
      </View>
    );
  }
}
