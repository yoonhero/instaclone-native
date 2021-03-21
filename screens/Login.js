import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const LogIn = ({ navigation }) => {
  return (
    <View>
      <Text>LogIn</Text>
      <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
        <Text>Go to Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};
