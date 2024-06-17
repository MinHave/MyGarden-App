import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useNavigation } from 'expo-router';
import {
  ICreatePlant,
  IGardenDetails,
  IPlantDetails,
} from '@/types/interfaces';
import apiService from '@/services/apiService';
import { TabActions, useIsFocused, useRoute } from '@react-navigation/native';
import ui from '@/store/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// The main functional component for the Plants Screen
export default function AddNewPlant() {
  // State to hold the list of plants
  const [getGarden, setGarden] = useState<IGardenDetails>();
  const [getPlantName, setPlantName] = useState('');
  const [getPlantDescription, setPlantDescription] = useState('');
  const [getPlantSpecie, setPlantSpecie] = useState('');
  const [getPlant, setPlant] = useState<IPlantDetails>();

  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);

  const route = useRoute();
  const { gardenId } = route.params as { gardenId: string };

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
    ui.setUpdateUI(true);
  }, [getGarden]);

  // Hook to check if the screen is focused
  const isFocused = useIsFocused();

  // Effect to fetch plants when the screen is focused
  useEffect(() => {
    if (isFocused) {
      onStartup();
    }
  }, [isFocused]);
  const fetchGardenDetails = async () => {
    let response = await apiService.getGarden(gardenId);
    setGarden(response.data);
  };
  //Function to initialize data fetching
  const onStartup = async () => {
    fetchGardenDetails();
  };

  const tryAddPlant = async () => {
    let newPlant: ICreatePlant | null = null;
    if (getGarden) {
      newPlant = {
        name: getPlantName,
        description: getPlantDescription,
        specie: getPlantSpecie,
        gardenId: getGarden.id,
      };
    }
    if (newPlant) {
      let response = await apiService.createPlant(newPlant);
      if (response.success) {
        navigation.dispatch(TabActions.jumpTo('plants'));
      }
    }
  };

  // Main component return with SafeAreaView and FlatList of plants
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Create new plant</ThemedText>
      </View>
      {getGarden != null ? (
        <ThemedText type="subtitle">{getGarden.gardenName}</ThemedText>
      ) : null}
      <View style={styles.card}>
        {/* <KeyboardAwareScrollView contentContainerStyle={styles.cardPadding}> */}
        <View>
          <View style={styles.cardPadding}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={getPlantName}
              keyboardType="default"
              onChangeText={(text) => setPlantName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={getPlantDescription}
              keyboardType="default"
              onChangeText={(text) => setPlantDescription(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Specie"
              value={getPlantSpecie}
              keyboardType="default"
              onChangeText={(text) => setPlantSpecie(text)}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => tryAddPlant()}
            >
              <Text style={styles.buttonText}>Create Plant</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </KeyboardAwareScrollView> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#333', // Dark background color
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardPadding: {
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#777', // Darker border color
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF', // Text color for dark theme
    backgroundColor: '#222', // Darker input background
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
});
