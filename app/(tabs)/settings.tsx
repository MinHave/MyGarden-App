import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import auth from '@/store/auth';
import LoginComponent from '@/components/login';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { TabActions, useIsFocused } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import ui from '@/store/ui';

export default function SettingsView() {
  const navigation = useNavigation();
  const [getLoading, setLoading] = useState(false);
  // Hook to check if the screen is focused
  const isFocused = useIsFocused();

  // Effect to fetch plants when the screen is focused
  useEffect(() => {
    if (isFocused) {
      onStartup();
    }
  }, [isFocused]);

  useEffect(() => {
    ui.setUpdateUI(true);
  }, [auth.currentUser]);

  function onStartup() {
    setLoading(false);
  }

  async function logout() {
    setLoading(true);
    let logoutResponse = await auth.LOGOUT();
    if (logoutResponse) {
      navigation.dispatch(TabActions.jumpTo('settings'));
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#333333' }}>
      <ThemedText type="title" style={{ color: '#FFF' }}>
        Settings
      </ThemedText>
      {!auth.isAuthorized() ? <LoginComponent navigation={navigation} /> : null}
      {auth.isAuthorized() ? (
        <View style={styles.card}>
          <ThemedText type="title">{auth.currentUser.name}</ThemedText>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => logout()}
          >
            {getLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign out</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
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
