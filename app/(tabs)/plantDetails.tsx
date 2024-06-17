import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useNavigation } from 'expo-router';
import { IPlantDetails } from '@/types/interfaces';
import apiService from '@/services/apiService';
import { TabActions, useIsFocused, useRoute } from '@react-navigation/native';
import ui from '@/store/ui';

// The main functional component for the Plants Screen
export default function PlantsList() {
  // State to hold the list of plants
  const [getPlant, setPlant] = useState<IPlantDetails>();

  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);
  const route = useRoute();
  // Access plantId from route.params
  const { plantId } = route.params as { plantId: string };
  const navigation = useNavigation();

  useEffect(() => {
    // Register the callback
    ui.registerUpdateUICallback((value) => {
      // Update the state to trigger a re-render
      setUiUpdateTrigger((prev) => prev + 1); // Increment to ensure change
    });

    // Cleanup the callback on component unmount
    return () => ui.registerUpdateUICallback(() => {});
  }, []);

  useEffect(() => {
    // console.log('getPlant: ', getPlant);
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
  async function deletePlant() {
    Alert.alert(
      `Delete plant ${getPlant?.name}`,
      `Are you sure you want to delete ${getPlant?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            confirmDeletePlant();
          },
        },
      ]
    );
  }
  async function confirmDeletePlant() {
    if (getPlant?.id) {
      let response = await apiService.deletePlant(getPlant);
      if (response.success) {
        navigation.dispatch(TabActions.jumpTo('plants'));
      }
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
        <View style={[styles.card, styles.cardPadding]}>
          <View>
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
          <View
            style={{
              width: '100%',
            }}
          >
            <TouchableOpacity
              onPress={() => deletePlant()}
              style={{
                backgroundColor: 'red',
                elevation: 0,
                width: 85,
                alignSelf: 'flex-start',
                paddingVertical: 8,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

// StyleSheet for the component
const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 14,
    marginTop: 10,
    backgroundColor: '#555', // Darker button background
  },
  buttonPrimary: {
    backgroundColor: '#007BFF',
  },
  buttonDisabled: {
    backgroundColor: '#444', // Darker disabled button
  },
  buttonText: {
    color: '#FFF', // Text color for dark theme
    fontSize: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cardPadding: {
    padding: 16,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#555',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    justifyContent: 'space-between', // Add this line
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: '100%',
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
