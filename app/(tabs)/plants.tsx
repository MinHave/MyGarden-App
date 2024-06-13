// This TypeScript React Native component displays a list of plants.
// It uses hooks for state management and effects, and navigates to a plant's details on touch.

// Imports from React Native, React, custom components, routing, types, and services
import {
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  View,
  PixelRatio,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { ISimplePlant } from "@/types/interfaces";
import apiService from "@/services/apiService";
import { RootStackParamList } from "@/navigation";
import { useIsFocused } from "@react-navigation/native";

// The main functional component for the Plants Screen
export default function PlantsList() {
  // State to hold the list of plants
  const [getPlants, setPlants] = useState<ISimplePlant[]>([]);
  // Hooks for routing and navigation
  const router = useRouter();
  const navigation = useNavigation();
  // Placeholder for theme logic
  const isThemeDark = false;
  // Hook to check if the screen is focused
  const isFocused = useIsFocused();

  // Effect to fetch plants when the screen is focused
  useEffect(() => {
    onStartup();
  }, [isFocused]);

  // Function to initialize data fetching
  const onStartup = () => {
    fetchPlants();
  };

  // Mock function to fetch plants data
  function fetchPlants() {
    // Placeholder for fetching plants data
    var result: ISimplePlant[] = [{ id: "8y97f-asd12-12asd5", name: "Test 1" }];
    setPlants(result);
  }

  // Function to handle navigation to plant details
  function plantDetails(plant: ISimplePlant) {
    navigation.navigate("PlantDetails", {
      plantId: plant.id,
    });
  }

  // Function to render each plant item
  const renderItem = ({ item }: { item: ISimplePlant }) => {
    return (
      <View
        style={{
          marginTop: PixelRatio.getPixelSizeForLayoutSize(8),
          marginHorizontal: PixelRatio.getPixelSizeForLayoutSize(4),
        }}
      >
        <ThemedView>
          <TouchableOpacity
            onPress={() => plantDetails(item)}
            style={{ flexDirection: "row", height: 90 }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                {item.name}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => plantDetails(item)}
                style={{
                  backgroundColor: "#009e73",
                  elevation: 0,
                  width: 85,
                  alignSelf: "center",
                  paddingVertical: 8,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  click me
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ThemedView>
      </View>
    );
  };

  // Main component return with SafeAreaView and FlatList of plants
  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Plants</ThemedText>
      </View>
      <View style={styles.titleContainer}>
        {getPlants.length > 0 ? (
          <FlatList
            data={getPlants}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

// StyleSheet for the component
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
