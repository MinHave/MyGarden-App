import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useNavigation } from 'expo-router';
import { IPlantDetails } from '@/types/interfaces';
import apiService from '@/services/apiService';
import { useIsFocused, useRoute } from '@react-navigation/native';
import ui from '@/store/ui';

// The main functional component for the Plants Screen
export default function PlantsList() {
  // State to hold the list of plants
  const [getPlant, setPlant] = useState<IPlantDetails>();

  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);
  const route = useRoute();
  // Access plantId from route.params
  const { plantId } = route.params as { plantId: string };

  useEffect(() => {
    // Register the callback
    ui.registerUpdateUICallback((value) => {
      console.log('UI update callback triggered', value);
      // Update the state to trigger a re-render
      setUiUpdateTrigger((prev) => prev + 1); // Increment to ensure change
    });

    // Cleanup the callback on component unmount
    return () => ui.registerUpdateUICallback(() => {});
  }, []);

  useEffect(() => {
    console.log('getPlant: ', getPlant);
  }, [getPlant]);

  // Hook to check if the screen is focused
  const isFocused = useIsFocused();

  // Effect to fetch plants when the screen is focused
  useEffect(() => {
    if (isFocused) {
      onStartup();
    }
  }, [isFocused]);

  // Function to initialize data fetching
  const onStartup = async () => {
    await fetchPlantDetails(plantId);
  };

  // Function to handle navigation to plant details
  async function fetchPlantDetails(plantId: string) {
    var result = await apiService.getPlant(plantId);
    if (result.data) {
      setPlant(result.data);
    }
  }

  // Main component return with SafeAreaView and FlatList of plants
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Plant details</ThemedText>
      </View>

      {/* Card */}
      {getPlant != null ? (
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{getPlant.name}</Text>
            <Text style={styles.subtitle}>{getPlant.specie}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.text}>{getPlant.description}</Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

// StyleSheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: '#555',
    borderRadius: 15,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green',
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
