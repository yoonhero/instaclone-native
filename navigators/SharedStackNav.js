import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image } from "react-native";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Me from "../screens/Me";
import Notification from "../screens/Notification";

import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Comments from "../screens/Comments";
import PhotoScreen from "../screens/Photo";

const Stack = createStackNavigator();

export default function SharedStackNav({ screenName }) {
  return (
    <Stack.Navigator
      headerMode='screen'
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
          shadowColor: "rgba(255, 255, 255, 0.3)",
        },
      }}>
      {screenName === "Feed" ? (
        <Stack.Screen
          name='Feed'
          component={Feed}
          options={{
            headerTitle: () => (
              <Image
                style={{
                  maxHeight: 40,
                }}
                resizeMode='contain'
                source={require("../assets/logo.png")}
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name='Search' component={Search} />
      ) : null}
      {screenName === "Notification" ? (
        <Stack.Screen name='Notification' component={Notification} />
      ) : null}
      {screenName === "Me" ? <Stack.Screen name='Me' component={Me} /> : null}
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Photo' component={PhotoScreen} />
      <Stack.Screen name='Likes' component={Likes} />
      <Stack.Screen name='Comments' component={Comments} />
    </Stack.Navigator>
  );
}
