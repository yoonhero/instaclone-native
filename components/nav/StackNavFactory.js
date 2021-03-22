import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Feed from "../../screens/Feed";
import Me from "../../screens/Me";
import Notification from "../../screens/Notification";
import Photo from "../../screens/Photo";
import Profile from "../../screens/Profile";
import Search from "../../screens/Search";

const Stack = createStackNavigator();

export default function StackNavFactory({ screenName }) {
  return (
    <Stack.Navigator>
      {screenName === "Feed" ? (
        <Stack.Screen name='Feed' component={Feed} />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name='Search' component={Search} />
      ) : null}
      {screenName === "Notification" ? (
        <Stack.Screen name='Notification' component={Notification} />
      ) : null}
      {screenName === "Feed" ? <Stack.Screen name='Me' component={Me} /> : null}
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Photo' component={Photo} />
    </Stack.Navigator>
  );
}
