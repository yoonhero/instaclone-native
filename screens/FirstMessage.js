import React, { useEffect } from "react";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { FontAwesome } from "@expo/vector-icons";

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $userId: Int) {
    sendMessage(payload: $payload, userId: $userId) {
      ok
    }
  }
`;
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const UserContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: white;
`;
const Username = styled.Text`
  margin-top: 20px;
  color: white;
  font-size: 25px;
  font-weight: 500;
`;
const FormContainer = styled.View`
  flex: 3;
  align-items: center;
  flex-direction: column;
  width: 95%;
  margin-top: 25px;
  align-items: center;
`;
const TextInput = styled.TextInput`
  background-color: white;
  padding: 10px 40px;
  font-size: 20px;
  border-radius: 20px;
  width: 300px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
`;
const Send = styled.TouchableOpacity`
  margin-top: 30px;
`;

export default function FirstMessage({ navigation, route }) {
  const [sendMessageMutation, { loading }] = useMutation(SEND_MESSAGE_MUTATION);
  const { register, setValue, handleSubmit, getValues, watch } = useForm();

  const onValid = async ({ message }) => {
    if (!loading) {
      await sendMessageMutation({
        variables: {
          payload: message,
          userId: route?.params?.user?.id,
        },
      });
      navigation.navigate("Rooms");
    }
  };
  useEffect(() => {
    register("message", { required: true });
    navigation.setOptions({
      title: "",
    });
  }, [register]);

  return (
    <ScreenLayout loading={loading}>
      <Container>
        <UserContainer>
          <Avatar source={{ uri: route?.params?.user?.avatar }} />
          <Username>{route?.params?.user?.username}</Username>
        </UserContainer>
        <FormContainer>
          <TextInput
            placeholderTextColor='rgba(255, 255, 255, 0.5)'
            placeholder='Write a message ...'
            returnKeyLabel='Send Message'
            returnKeyType='send'
            onChangeText={(text) => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
          />
          <Send onPress={handleSubmit(onValid)}>
            <FontAwesome name='paper-plane' size={34} color='#eeeeee' />
          </Send>
        </FormContainer>
      </Container>
    </ScreenLayout>
  );
}
