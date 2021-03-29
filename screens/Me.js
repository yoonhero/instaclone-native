import React from "react";
import { useEffect } from "react";

import useMe from "../hooks/useMe";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useState } from "react";

import { Image, RefreshControl } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";

import styled from "styled-components/native";
import { colors } from "../colors";
import ScreenLayout from "../components/ScreenLayout";
import { PHOTO_FRAGMENT } from "../fragments";

const SEE_PROFILE = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
      lastName
      username
      bio
      id
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Text = styled.Text`
  color: white;
  margin-right: 10px;
`;

const View = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 10px;
`;

const UserContainer = styled.View`
  width: 100%;
  padding: 20px;

  flex: 1;
  align-items: center;
  flex-direction: row;
`;
const UserAvatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;
const UserInformation = styled.View`
  margin-left: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 10px 5px;
  border-radius: 3px;
  margin-left: 10px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;
const Username = styled.Text`
  font-size: 23px;
  font-weight: 600;
  color: white;
`;
const FirstName = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 500;
`;
const LastName = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 500;
`;
const Caption = styled.Text`
  margin-top: 10px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  max-width: 80%;
`;
const PhotoContainer = styled.View`
  flex: 2;
`;

export default function Me({ navigation }) {
  const { data: meData } = useMe();

  useEffect(() => {
    navigation.setOptions({
      title: meData?.me?.username,
    });
    setUsername(meData?.me?.username);
  }, []);

  const [username, setUsername] = useState("");
  const numColumns = 3;
  const { width } = useWindowDimensions();
  const { data, loading, refetch } = useQuery(SEE_PROFILE, {
    variables: {
      username: username,
    },
  });

  const getButton = (seeProfile) => {
    const { isMe } = seeProfile;
    if (isMe) {
      return (
        <Button>
          <ButtonText>Edit Profile</ButtonText>
        </Button>
      );
    }
  };
  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Photo", {
          photoId: photo.id,
        });
      }}>
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / numColumns, height: width / numColumns }}
      />
    </TouchableOpacity>
  );
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScreenLayout loading={loading}>
      <UserContainer>
        <UserAvatar
          resizeMode='cover'
          source={{
            uri: data?.seeProfile?.avatar,
          }}
        />
        <UserInformation>
          <View>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </View>
          <View>
            <Text>{data?.seeProfile?.totalFollowers} followers</Text>
            <Text>{data?.seeProfile?.totalFollowing} following</Text>
          </View>
          <View>
            <FirstName>{data?.seeProfile?.firstName}</FirstName>
            <LastName>{data?.seeProfile?.lastName}</LastName>
          </View>
          <Caption>{data?.seeProfile?.bio}</Caption>
        </UserInformation>
      </UserContainer>
      <PhotoContainer>
        <FlatList
          numColumns={numColumns}
          data={data?.seeProfile?.photos}
          keyExtractor={(photo) => "" + photo.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tineColor='white'
            />
          }
        />
      </PhotoContainer>
    </ScreenLayout>
  );
}
