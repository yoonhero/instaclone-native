import React from "react";
import { useRef } from "react";
import { KeyboardAvoidingView } from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import { AuthLayout } from "../components/auth/AuthLayout";

const TextInput = styled.TextInput`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px 8px;
  margin-bottom: 8px;
  border-radius: 4px;
`;

export const CreateAccount = () => {
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const onDone = () => {
    alert("done!");
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        style={{
          width: "100%",
        }}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
        <TextInput
          placeholder='First Name'
          placeholderTextColor='gray'
          returnKeyType='next'
          onSubmitEditing={() => {
            onNext(lastNameRef);
          }}
        />
        <TextInput
          ref={lastNameRef}
          placeholder='Last Name'
          placeholderTextColor='gray'
          returnKeyType='next'
          onSubmitEditing={() => {
            onNext(usernameRef);
          }}
        />
        <TextInput
          ref={usernameRef}
          placeholder='Username'
          placeholderTextColor='gray'
          returnKeyType='next'
          onSubmitEditing={() => {
            onNext(emailRef);
          }}
        />
        <TextInput
          ref={emailRef}
          placeholder='Email'
          placeholderTextColor='gray'
          keyboardType='email-address'
          returnKeyType='next'
          onSubmitEditing={() => {
            onNext(passwordRef);
          }}
        />
        <TextInput
          ref={passwordRef}
          placeholder='Password'
          placeholderTextColor='gray'
          secureTextEntry
          returnKeyType='done'
          onSubmitEditing={onDone}
        />
        <AuthButton
          text='Create Account'
          disabled={true}
          onPress={() => null}
        />
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};
