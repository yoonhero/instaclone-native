import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import gql from "graphql-tag";
import React, { useState, useEffect } from "react";
import { FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import useMe from "../hooks/useMe";
import { TouchableOpacity } from "react-native-gesture-handler";

const ROOM_UPDATE = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
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

const READ_MESSAGE_MUTATION = gql`
  mutation readMessage($id: Int!) {
    readMessage(id: $id) {
      ok
      error
    }
  }
`;

const MessageContiainer = styled.View`
  padding: 0px 10px;

  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
`;
const Author = styled.View``;
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
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "rgba(255, 255, 255, 0.3)"};

  padding: 10px 20px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;
const TextInput = styled.TextInput`
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  color: white;
  border-radius: 1000px;
  width: 90%;
  margin-right: 10px;
`;
const InputContainer = styled.View`
  flex-direction: row;
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  align-items: center;
`;
const SendButton = styled.TouchableOpacity``;

export default function Room({ route, navigation }) {
  const { data: meData } = useMe();

  const { register, setValue, handleSubmit, getValues, watch } = useForm();

  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        payload: message,
        user: {
          username: meData.me.username,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: "Message",
      };
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });
      const ROOM_ID = `Room:${route.params.id}`;
      cache.modify({
        id: ROOM_ID,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });

  const [readMessageMutation] = useMutation(READ_MESSAGE_MUTATION);
  const [readMessage, setReadMessage] = useState(0);
  const client = useApolloClient();
  const updateQuery = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;
    if (message.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: message,
      });
      const ROOM_ID = `Room:${route.params.id}`;
      client.cache.modify({
        id: ROOM_ID,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage) => aMessage.__ref === incomingMessage.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, incomingMessage];
          },
        },
      });
    }
  };
  useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATE,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      });
    }
  }, [data]);
  const onValid = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route?.params?.id,
        },
      });
    }
  };

  useEffect(() => {
    register("message", { required: true });
  }, [register]);
  const headerLeft = () => (
    <TouchableOpacity onPress={() => navigation.navigate("Rooms")}>
      <Ionicons name='arrow-back' color='white' size={28} />
    </TouchableOpacity>
  );
  useEffect(() => {
    navigation.setOptions({
      title: `Conversation with ${route?.params?.talkingTo?.username}`,

      headerLeft,
    });
  }, []);

  useEffect(() => {
    readMessageMutation({
      variables: {
        id: readMessage,
      },
    });
  }, [readMessage]);
  const renderItem = ({ item: message }) => (
    <MessageContiainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}>
      {message.user.username === route?.params?.talkingTo?.username ? (
        <Author>
          <Avatar source={{ uri: message.user.avatar }} />
        </Author>
      ) : null}

      <Message
        outGoing={message.user.username !== route?.params?.talkingTo?.username}>
        {message.payload}
      </Message>
    </MessageContiainer>
  );

  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.sort(function (a, b) {
    return a.id - b.id;
  });
  messages.reverse();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior='padding'
      keyboardVerticalOffset={50}>
      <ScreenLayout loading={loading}>
        <FlatList
          inverted
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", marginVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
          data={messages}
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <InputContainer>
          <TextInput
            placeholderTextColor='rgba(255, 255, 255, 0.5)'
            placeholder='Write a message ...'
            returnKeyLabel='Send Message'
            returnKeyType='send'
            onChangeText={(text) => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("message"))}>
            <Ionicons
              name='send'
              color={
                !Boolean(watch("message"))
                  ? "rgba(255, 255, 255, 0.5)"
                  : "white"
              }
              size={22}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
