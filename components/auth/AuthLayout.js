import React from "react";
import styled from "styled-components/native";
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
  margin-bottom: 20px;
  height: 100px;
`;

export const AuthLayout = ({ children }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      <Container>
        <Logo resizeMode='contain' source={require("../../assets/logo.png")} />
        {children}
      </Container>
    </TouchableWithoutFeedback>
  );
};
