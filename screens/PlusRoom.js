import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hooks/useMe";
import styled from "styled-components/native";

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

const Username = styled.Text`
  color: white;
  background-color: blue;
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
  const renderItem = ({ item: user }) => <Username>{user.username}</Username>;
  console.log(data?.seeFollowing?.following);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}></View>
        }
        style={{ width: "100%" }}
        data={data?.seeFollowing?.following}
        keyExtractor={(user) => "" + user.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
