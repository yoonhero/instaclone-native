import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import Rooms from "../screens/Rooms";
import Room from "../screens/Room";
import PlusRoom from "../screens/PlusRoom";

const Stack = createStackNavigator();

export default function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerBackTitleVisible: false,
        headerStyle: {
          borderBottomColor: "rgba(255, 255, 255, 0.3)",
          shadowColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "black",
        },
      }}>
      <Stack.Screen
        name='Rooms'
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons name='chevron-down' color={tintColor} size={28} />
          ),
        }}
        component={Rooms}
      />
      <Stack.Screen name='Room' component={Room} />
      <Stack.Screen name='PlusRoom' component={PlusRoom} />
    </Stack.Navigator>
  );
}
