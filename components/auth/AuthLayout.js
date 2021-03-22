import React from "react";
import styled from "styled-components/native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 0px 40px;
`;
const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

export const AuthLayout = ({ children }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior='position'
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}>
          <Logo
            resizeMode='contain'
            source={require("../../assets/logo.png")}
          />
          {children}
        </KeyboardAvoidingView>
      </Container>
    </TouchableWithoutFeedback>
  );
};
