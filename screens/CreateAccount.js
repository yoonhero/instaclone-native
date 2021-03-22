import React, { useRef, useEffect } from "react";

import AuthButton from "../components/auth/AuthButton";
import { AuthLayout } from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

export const CreateAccount = ({ navigation }) => {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const onCompleted = (data) => {
    const {
      createAccount: { ok },
    } = data;
    const { username, password } = getValues();
    if (ok) {
      navigation.navigate("LogIn", {
        username,
        password,
      });
    }
  };
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };
  const onValid = (data) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
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
        disabled={
          !watch("username") ||
          !watch("password") ||
          !watch("lastName") ||
          !watch("firstName") ||
          !watch("email")
        }
        onPress={handleSubmit(onValid)}
        loading={loading}
      />
    </AuthLayout>
  );
};
