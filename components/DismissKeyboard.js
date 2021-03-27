import React from "react";
import { Keyboard, TouchableWithoutFeedback, Platform } from "react-native";

export default function DismissKeyboard({ children }) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}>
      {children}
    </TouchableWithoutFeedback>
  );
}
