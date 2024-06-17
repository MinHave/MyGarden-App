import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import apiService from '../services/apiService';
import { showMessage } from 'react-native-flash-message';

interface ChangePasswordComponentProps {
  navigation: any;
  route: any;
}

const ChangePasswordComponent: React.FC<ChangePasswordComponentProps> = ({
  navigation,
  route,
}) => {
  const { passedEmail } = route.params;
  const [getEmail, setEmail] = useState('');

  useEffect(() => {
    setEmail(passedEmail);
  }, [passedEmail]);

  const resetPassword = async () => {
    await apiService.resetPassword(getEmail).then(() => {
      navigation.dispatch(CommonActions.goBack());
      showMessage({
        message: 'Sendt',
        description: 'E-mail til at ændre kodeord sendt',
        type: 'default',
        backgroundColor: '#28A745', // Replace with your primary green color
      });
    });
  };

  return (
    <View style={styles.card}>
      <ScrollView contentContainerStyle={styles.cardPadding}>
        <View>
          <View style={styles.cardPadding}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#AAA"
              value={getEmail}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[
                styles.button,
                getEmail ? styles.buttonPrimary : styles.buttonDisabled,
              ]}
              onPress={resetPassword}
              disabled={!getEmail}
            >
              <Text style={styles.buttonText}>Send kode via e-mail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardPadding: {
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF',
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPrimary: {
    backgroundColor: '#007BFF',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default ChangePasswordComponent;
