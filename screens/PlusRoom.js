import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import useMe from "../hooks/useMe";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ROOM_FRAGMENT } from "../fragments";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;
const SEE_USERS = gql`
  query seeFollowing($username: String!) {
    seeFollowing(username: $username) {
      ok
      following {
        username
        avatar
        id
      }
    }
  }
`;

const Container = styled.View`
  padding: 20px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const UserContainer = styled.TouchableOpacity`
  flex-direction: row;

  align-items: center;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: white;
`;

const Username = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export default function PlusRoom({ navigation }) {
  const { data: meData } = useMe();
  const { data: roomData } = useQuery(SEE_ROOMS_QUERY, {
    variables: {
      username: meData?.me?.username,
    },
  });
  const { data, loading, refetch } = useQuery(SEE_USERS, {
    variables: {
      username: meData?.me?.username,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const createRoom = (user) => {
    const { username } = user;
    let existing = [];

    let existingRoom = [];
    roomData.seeRooms.find((room) => {
      room.users.find((user) => {
        if (user.username === username) {
          existing = user;
        }
      });
      if (existing.length !== 0) {
        existingRoom = room;
      }
    });
    if (existing.length !== 0) {
      navigation.navigate("Room", {
        id: existingRoom.id,
        talkingTo: existing,
      });
    } else {
      navigation.navigate("FirstMessage", {
        user: user,
      });
    }
  };
  const renderItem = ({ item: user }) => (
    <Container>
      <UserContainer onPress={() => createRoom(user)}>
        <Avatar source={{ uri: user.avatar }} />
        <Username>{user.username}</Username>
      </UserContainer>
      <TouchableOpacity onPress={() => createRoom(user)}>
        <FontAwesome5 name='plus' size={24} color='white' />
      </TouchableOpacity>
    </Container>
  );

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{ width: "100%" }}
        data={data?.seeFollowing?.following}
        keyExtractor={(user) => "" + user.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tineColor='white'
          />
        }
      />
    </ScreenLayout>
  );
}
