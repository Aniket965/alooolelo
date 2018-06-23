import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 2
    };
  }
  render() {
    return (
      <View style={styles.header}>
        <Text
          style={[
            styles.headerButton,
            { color: this.state.current === 1 ? "#0e74f9" : "black" }
          ]}
          onPress={() => {
            this.setState({ current: 1 });
            // this.props.selected(1);
          }}
        >
          Sports
        </Text>
        <Text
          style={[
            styles.headerButton,
            { color: this.state.current === 2 ? "#0e74f9" : "black" }
          ]}
          onPress={() => {
            this.setState({ current: 2 });
            // this.props.selected(2);
          }}
        >
          LifeStyle
        </Text>
        <Text
          style={[
            styles.headerButton,
            { color: this.state.current === 3 ? "#0e74f9" : "black" }
          ]}
          onPress={() => {
            this.setState({ current: 3 });
            // this.props.selected(3);
          }}
        >
          {" "}
          Techquie
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    display: "flex",
    backgroundColor: "white"
  },
  headerButton: {
    color: "black",
    fontWeight: "bold",
    fontSize: 36,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flex: 1,
    textAlign: "center",
    paddingTop: 36
  }
});
