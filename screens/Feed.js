import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Feed({ navigation }) {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
        <Text style={{ color: "white" }}>Feed</Text>
      </TouchableOpacity>
    </View>
  );
}
