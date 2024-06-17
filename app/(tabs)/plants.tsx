import {
  StyleSheet,
  SafeAreaView,
  View,
  PixelRatio,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useNavigation } from 'expo-router';
import { ISimpleGarden, ISimplePlant, OptionItem } from '@/types/interfaces';
import apiService, { ApiResponse } from '@/services/apiService';
import { TabActions, useIsFocused } from '@react-navigation/native';
// import { SelectDropdown, DropdownData } from 'expo-select-dropdown';
import ui from '@/store/ui';
// import { Dropdown } from 'react-native-element-dropdown';
import { SelectList } from 'react-native-dropdown-select-list';

// The main functional component for the Plants Screen
export default function PlantsList() {
  // State to hold the list of plants
  const [getPlants, setPlants] = useState<ISimplePlant[]>([]);
  const [getGarden, setGarden] = useState<ISimpleGarden>();
  const [getGardens, setGardens] = useState<ISimpleGarden[]>();
  const [selected, setSelected] = React.useState('');

  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);

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

  // Hooks for routing and navigation
  const router = useRouter();
  const navigation = useNavigation();
  // Hook to check if the screen is focused
  const isFocused = useIsFocused();

  // Effect to fetch plants when the screen is focused
  useEffect(() => {
    if (isFocused) {
      onStartup();
    }
  }, [isFocused]);

  useEffect(() => {
    if (getGarden != undefined) {
      console.log('getGarden is called');
      fetchPlants();
      ui.setUpdateUI(true);
    }
  }, [getGarden]);

  useEffect(() => {
    if (getGardens && getGardens.length > 0) {
      makeGardenListToDropDownData();
      // fetchPlants();
    }
  }, [getGardens]);

  // useEffect(() => {
  //   console.log('getPlants', getPlants);
  // }, [getPlants]);

  // Function to initialize data fetching
  const onStartup = async () => {
    await getAllGardens();
  };

  function mapToDropDownData(garden: ISimpleGarden) {
    return { key: garden.id, value: garden.gardenName };
  }

  function makeGardenListToDropDownData() {
    var optionItems: OptionItem[] = [];
    if (getGardens && getGardens?.length > 0) {
      getGardens.forEach((garden) => {
        optionItems.push(mapToDropDownData(garden));
      });
    }
    return optionItems;
  }

  async function getAllGardens() {
    var result: ApiResponse<ISimpleGarden[]> | null = null;
    result = await apiService.getGardenList();

    if (result != null) {
      setGardens(result.data);
    }
  }

  function dropdownToGarden(val: string) {
    var garden = getGardens?.find((x) => x.id == val);
    setGarden(garden);
    getAllGardens();
  }

  // Mock function to fetch plants data
  async function fetchPlants() {
    var result: ApiResponse<ISimplePlant[]> | null = null;
    if (getGarden != undefined) {
      result = await apiService.getPlants(getGarden.id);

      if (result.data) {
        console.log('1', getGarden.id);

        setPlants(result.data);
      }
    }
  }

  // Function to handle navigation to plant details
  function plantDetails(plant: ISimplePlant) {
    navigation.dispatch(
      TabActions.jumpTo('plantDetails', { plantId: plant.id })
    );
    // navigation.navigate('PlantDetails', {
    //   plantId: plant.id,
    // });
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
            style={{ flexDirection: 'row', height: 90 }}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 18,
                  textAlign: 'center',
                }}
              >
                {item.name}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => plantDetails(item)}
                style={{
                  backgroundColor: '#009e73',
                  elevation: 0,
                  width: 85,
                  alignSelf: 'center',
                  paddingVertical: 8,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>
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
      <View>
        {getGardens && getGardens?.length > 0 ? (
          <SelectList
            placeholder="Select garden"
            setSelected={(val: any) => setSelected(val)}
            onSelect={() => dropdownToGarden(selected)}
            save="key"
            data={makeGardenListToDropDownData()}
            dropdownTextStyles={{ color: '#fff' }}
            inputStyles={{ color: '#fff' }}
          />
        ) : null}
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
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
