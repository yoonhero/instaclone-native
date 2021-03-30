import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import useMe from "../hooks/useMe";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { FontAwesome5 } from "@expo/vector-icons";

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
const UserContainer = styled.View`
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
  const { data, loading } = useQuery(SEE_USERS, {
    variables: {
      username: meData?.me?.username,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: "Users",
    });
  }, []);
  const renderItem = ({ item: user }) => (
    <Container>
      <UserContainer>
        <Avatar source={{ uri: user.avatar }} />
        <Username>{user.username}</Username>
      </UserContainer>
      <FontAwesome5 name='plus' size={24} color='white' />
    </Container>
  );

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{ width: "100%" }}
        data={data?.seeFollowing?.following}
        keyExtractor={(user) => "" + user.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
