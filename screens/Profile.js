import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Image } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";

import styled from "styled-components/native";
import { colors } from "../colors";
import ScreenLayout from "../components/ScreenLayout";
import { PHOTO_FRAGMENT } from "../fragments";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;
const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

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

export default function Profile({ navigation, route }) {
  const [username, setUsername] = useState("");
  const numColumns = 3;
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route.params.username,
      });
      setUsername(route?.params?.username);
    }
  }, []);
  const { data, loading } = useQuery(SEE_PROFILE, {
    variables: {
      username: route?.params?.username,
    },
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;

    if (!ok) {
      return;
    }

    cache.modify({
      id: `User:${data?.seeProfile?.id}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: unfollowUserUpdate,
  });
  const followUserUpdate = (cache, result) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;

    if (!ok) {
      return;
    }

    cache.modify({
      id: `User:${data?.seeProfile?.id}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: followUserUpdate,
  });
  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return (
        <Button>
          <ButtonText>Edit Profile</ButtonText>
        </Button>
      );
    }
    if (isFollowing) {
      return (
        <Button onPress={() => unfollowUser()}>
          <ButtonText>Unfollow</ButtonText>
        </Button>
      );
    } else {
      return (
        <Button onPress={() => followUser()}>
          <ButtonText>Follow</ButtonText>
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
        />
      </PhotoContainer>
    </ScreenLayout>
  );
}
