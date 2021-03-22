import React, { useRef, useEffect } from "react";

import AuthButton from "../components/auth/AuthButton";
import { AuthLayout } from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { useForm } from "react-hook-form";

export const CreateAccount = () => {
  const { register, handleSubmit, setValue } = useForm();

  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };
  const onValid = (data) => {
    console.log(data);
  };

  useEffect(() => {
    register("firstName", {
      required: true,
    });
    register("lastName", {
      required: true,
    });
    register("username", {
      required: true,
    });
    register("email", {
      required: true,
    });
    register("password", {
      required: true,
    });
  }, [register]);
  return (
    <AuthLayout>
      <TextInput
        placeholder='First Name'
        placeholderTextColor='gray'
        returnKeyType='next'
        onSubmitEditing={() => {
          onNext(lastNameRef);
        }}
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onChangeText={(text) => setValue("firstName", text)}
      />
      <TextInput
        ref={lastNameRef}
        placeholder='Last Name'
        placeholderTextColor='gray'
        returnKeyType='next'
        onSubmitEditing={() => {
          onNext(usernameRef);
        }}
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onChangeText={(text) => setValue("lastName", text)}
      />
      <TextInput
        ref={usernameRef}
        placeholder='Username'
        autoCapitalize='none'
        placeholderTextColor='gray'
        returnKeyType='next'
        onSubmitEditing={() => {
          onNext(emailRef);
        }}
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onChangeText={(text) => setValue("username", text)}
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
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onChangeText={(text) => setValue("email", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder='Password'
        placeholderTextColor='gray'
        secureTextEntry
        returnKeyType='done'
        onSubmitEditing={handleSubmit(onValid)}
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onChangeText={(text) => setValue("password", text)}
      />
      <AuthButton
        text='Create Account'
        disabled={true}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
};
