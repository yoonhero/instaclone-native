import React from "react";
import { useRef } from "react";
import { TextInput } from "react-native-gesture-handler";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import { AuthLayout } from "../components/auth/AuthLayout";

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
      <TextInput
        placeholder='First Name'
        placeholderTextColor='gray'
        returnKeyType='next'
        style={{ backgroundColor: "white", width: "100%" }}
        onSubmitEditing={() => {
          onNext(lastNameRef);
        }}
      />
      <TextInput
        ref={lastNameRef}
        placeholder='Last Name'
        placeholderTextColor='gray'
        returnKeyType='next'
        style={{ backgroundColor: "white", width: "100%" }}
        onSubmitEditing={() => {
          onNext(usernameRef);
        }}
      />
      <TextInput
        ref={usernameRef}
        placeholder='Username'
        placeholderTextColor='gray'
        returnKeyType='next'
        style={{ backgroundColor: "white", width: "100%" }}
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
        style={{ backgroundColor: "white", width: "100%" }}
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
        style={{ backgroundColor: "white", width: "100%" }}
        onSubmitEditing={onDone}
      />
      <AuthButton text='Create Account' disabled={true} onPress={() => null} />
    </AuthLayout>
  );
};
