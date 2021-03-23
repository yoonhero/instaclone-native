import React, { useEffect } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import { AuthLayout } from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

export const LogIn = ({ route: { params } }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      password: params?.password,
      username: params?.username,
    },
  });
  const passwordRef = useRef();
  const onCompleted = async (data) => {
    const {
      login: { ok, token },
    } = data;

    if (ok) {
      await logUserIn(token);
    }
  };
  const [logInMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const onValid = (data) => {
    if (!loading) {
      logInMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  useEffect(() => {
    register("username", {
      required: true,
    });
    register("password", {
      required: true,
    });
  }, [register]);
  return (
    <AuthLayout>
      <TextInput
        value={watch("username")}
        placeholder='Username'
        returnKeyType='next'
        autoCapitalize='none'
        placeholderTextColor={"rgba(255, 255, 255, 0.8)"}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("username", text)}
      />
      <TextInput
        value={watch("password")}
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
        text='Log In'
        disabled={!watch("username") || !watch("password")}
        onPress={handleSubmit(onValid)}
        loading={loading}
      />
    </AuthLayout>
  );
};
