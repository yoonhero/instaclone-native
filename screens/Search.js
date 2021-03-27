import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MessageText = styled.Text`
  margin-top: 15px;
  color: white;
  font-weight: 600;
`;
const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  color: black;
  width: ${(props) => props.width / 1.5}px;
  padding: 7px 10px;
  border-radius: 7px;
`;

export default function Search({ navigation }) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);
  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword: watch("keyword"),
      },
    });
  };
  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor='rgba(0,0,0,0.8)'
      placeholder='Search photos'
      autoCapitalize='none'
      returnKeyLabel='Search'
      returnKeyType='search'
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );

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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword", {
      required: true,
      minLength: 3,
    });
  }, []);

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size='large' />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos?.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              numColumns={numColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => "" + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </View>
    </DismissKeyboard>
  );
}
