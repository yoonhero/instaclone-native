import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { logUserOut } from "../apollo";

export default function Notification() {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text style={{ color: "white" }}>Notification</Text>
      <TouchableOpacity onPress={logUserOut}>
        <Text style={{ color: "white" }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
