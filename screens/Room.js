import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useEffect } from "react";
import { FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;
const MessageContiainer = styled.View`
  margin: 5px;
  padding: 0px 10px;
  flex-direction: row;
  align-items: flex-end;
`;
const Author = styled.View`
  margin-right: 10px;
`;
const Avatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: white;
`;
const Username = styled.Text`
  color: white;
`;
const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 16px;
`;
const TextInput = styled.TextInput`
  margin-bottom: 50px;
  margin-top: 25px;
  width: 95%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  color: white;
  border-radius: 1000px;
`;
export default function Room({ route, navigation }) {
  const { data, loading } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  useEffect(() => {
    navigation.setOptions({
      title: `Conversation with ${route?.params?.talkingTo?.username}`,
    });
  }, []);
  const renderItem = ({ item: message }) => (
    <MessageContiainer>
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContiainer>
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior='padding'
      keyboardVerticalOffset={50}>
      <ScreenLayout loading={loading}>
        <FlatList
          inverted
          style={{ width: "100%" }}
          data={data?.seeRoom?.messages}
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <TextInput
          placeholderTextColor='rgba(255, 255, 255, 0.5)'
          placeholder='Write a message ...'
          returnKeyLabel='Send Message'
          returnKeyType='send'
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
