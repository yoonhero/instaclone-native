import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { ROOM_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import RoomItem from "../components/rooms/RoomItem";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

export default function Rooms({ navigation }) {
  const { data, loading, refetch } = useQuery(SEE_ROOMS_QUERY);
  const [refreshing, setRefreshing] = useState(false);
  const PlusButton = () => (
    <TouchableOpacity
      style={{ marginRight: 25 }}
      onPress={() => navigation.navigate("PlusRoom")}>
      <FontAwesome5 name='user-plus' color='white' size={20} />
    </TouchableOpacity>
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: PlusButton,
    });
  }, []);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const renderItem = ({ item: room }) => <RoomItem {...room} />;
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{ width: "100%" }}
        data={data?.seeRooms}
        renderItem={renderItem}
        keyExtractor={(room) => "" + room.id}
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
