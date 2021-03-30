import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { logUserOut } from "../apollo";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

export const FEED_QUERY = gql`
  query seeFeed($offset: Int!, $limit: Int!) {
    seeFeed(offset: $offset, limit: $limit) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      likes
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
      isLiked
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default function Feed({ navigation }) {
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
      limit: 2,
    },
  });

  const renderPhoto = ({ item: photo }) => {
    return <Photo {...photo} />;
  };
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  const MessagesButton = () => (
    <TouchableOpacity
      style={{ marginRight: 25 }}
      onPress={() => navigation.navigate("Messages")}>
      <Ionicons name='paper-plane' color='white' size={20} />
    </TouchableOpacity>
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: MessagesButton,
    });
  }, []);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
              limit: 3,
            },
          })
        }
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
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
