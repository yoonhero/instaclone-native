import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { logUserOut } from "../apollo";

export default function Search({ navigation }) {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <TouchableOpacity onPress={() => logUserOut()}>
        <Text style={{ color: "white" }}>logout </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
        <Text style={{ color: "white" }}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}
