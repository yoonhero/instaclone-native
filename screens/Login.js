import React, { useEffect } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import { AuthLayout } from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";

export const LogIn = () => {
  const { register, handleSubmit, setValue } = useForm();

  const passwordRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const onValid = (data) => {
    console.log(data);
  };

  useEffect(() => {
    register("username");
    register("password");
  }, [register]);
  return (
    <AuthLayout>
      <TextInput
        placeholder='Username'
        returnKeyType='next'
        autoCapitalize='none'
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("username", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder='Password'
        secureTextEntry
        returnKeyType='done'
        lastOne={true}
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text) => setValue("password", text)}
      />
      <AuthButton
        text='Create Account'
        disabled={false}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
};
