import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useNavigation } from 'expo-router';
import { IAccount } from '@/types/interfaces';
import apiService from '@/services/apiService';
import { TabActions, useIsFocused, useRoute } from '@react-navigation/native';
import ui from '@/store/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validEmail } from '@/plugins/utils';

export default function AddNewAccount() {
  const [getName, setName] = useState('');
  const [getUsername, setUsername] = useState('');
  // const [getPassword1, setPassword1] = useState('');
  // const [getPassword2, setPassword2] = useState('');
  const [getPhoneNumber, setPhoneNumber] = useState('');

  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);

  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);

  const route = useRoute();
  // const { gardenId } = route.params as { gardenId: string };

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
  // Hook to check if the screen is focused
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      onStartup();
    }
  }, [isFocused]);

  //Function to initialize data fetching
  const onStartup = async () => {
    setName('');
    setUsername('');
    // setPassword1('');
    // setPassword2('');
    setPhoneNumber('');
  };

  // This function should validate all the get entries for user.
  const validateEntries = () => {
    if (getName === '') {
      Alert.alert('Name must be set', '', [{ text: 'OK' }]);
      return false;
    }
    if (!validEmail(getUsername)) {
      Alert.alert('Email must be set', '', [{ text: 'OK' }]);
      return false;
    }
    if (getPhoneNumber === '') {
      Alert.alert('Phone number must be set', '', [{ text: 'OK' }]);
      return false;
    }
    // if (getPassword1 === '') {
    //   Alert.alert('Password must be set', '', [{ text: 'OK' }]);
    //   return false;
    // }
    // if (getPassword2 !== getPassword1) {
    //   Alert.alert('Passwords must match', '', [{ text: 'OK' }]);
    //   return false;
    // }
    return true;
  };

  const tryAddAccount = async () => {
    if (validateEntries()) {
      let newAccount: IAccount = {
        id: '',
        name: getName,
        username: getUsername,
        password: '',
        // password: getPassword1,
        phoneNumber: getPhoneNumber,
        email: getUsername,
      };
      const response = await apiService.registerUser(newAccount);
      console.log('response', response);
      if (response.success) {
        Alert.alert('Account created', 'Account was created successfully', [
          { text: 'OK' },
        ]);
        navigation.dispatch(TabActions.jumpTo('settings'));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Create new account</ThemedText>
      </View>
      <KeyboardAwareScrollView style={{ width: '100%' }}>
        <View style={styles.card}>
          <View>
            <View style={styles.cardPadding}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={getName}
                keyboardType="default"
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={getUsername}
                keyboardType="email-address"
                onChangeText={(text) => setUsername(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={getPhoneNumber}
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
              />
              {/* <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passworInput]}
                  placeholder="Password"
                  value={getPassword1}
                  keyboardType="default"
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => setPassword1(text)}
                />
                <TouchableOpacity
                  style={styles.passworHide}
                  onPress={() => setHidePassword(!hidePassword)}
                >
                  <Text style={{ color: 'white' }}>
                    {hidePassword ? 'show' : 'hide'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passworInput]}
                  placeholder="Repeat password"
                  value={getPassword2}
                  keyboardType="default"
                  secureTextEntry={hidePassword2}
                  onChangeText={(text) => setPassword2(text)}
                />
                <TouchableOpacity
                  style={styles.passworHide}
                  onPress={() => setHidePassword2(!hidePassword2)}
                >
                  <Text style={{ color: 'white' }}>
                    {hidePassword2 ? 'show' : 'hide'}
                  </Text>
                </TouchableOpacity>
              </View> */}

              <TouchableOpacity
                style={styles.button}
                onPress={() => tryAddAccount()}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passwordRow: {
    flex: 1,
    flexDirection: 'row',
  },
  passworInput: {
    flex: 1,
  },
  passworHide: {
    width: 50,
    justifyContent: 'center',
  },
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
    margin: 5,
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
