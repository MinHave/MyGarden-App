import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { login } from '@/services/apiService';
import auth from '../store/auth';
import { showMessage } from 'react-native-flash-message';
import { Credentials } from '@/services/apiService';
import { ICurrentUser } from '@/store/interfaces/auth';

interface LoginComponentProps {
  navigation: any;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ navigation }) => {
  const [getEmail, setEmail] = useState('mgc@tavsogmatias.com');
  const [getPassword, setPassword] = useState('P@ssw0rd');
  const [getHidePassword, setHidePassword] = useState(true);
  const [getLoading, setLoading] = useState(false);

  const tryLogin = async () => {
    setLoading(true);
    const data: Credentials = {
      username: getEmail,
      password: getPassword,
    };
    try {
      const result = await login(data);
      console.log('Login result:', result);
      const resultData = result.data as ICurrentUser;
      if (!result.success) {
        setLoading(false);
        showMessage({
          message: 'Login failed',
          description: result.message,
          type: 'default',
          backgroundColor: '#FF0000', // Error color
        });
      } else {
        if (resultData.email != null) {
          await auth.setUser(resultData);
          setLoading(false);
          navigation.dispatch(StackActions.replace('Scan'));
        } else {
          setLoading(false);
          showMessage({
            message: 'Invalid login',
            description: 'This app is only for instructors',
            type: 'default',
            backgroundColor: '#FF0000', // Error color
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      showMessage({
        message: 'Login error',
        description: 'A network error occurred. Please try again later.',
        type: 'default',
        backgroundColor: '#FF0000', // Error color
      });
    }
  };

  return (
    <View style={styles.card}>
      <KeyboardAwareScrollView contentContainerStyle={styles.cardPadding}>
        <View>
          <View style={styles.cardPadding}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={getEmail}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={getHidePassword}
                value={getPassword}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={() => setHidePassword(!getHidePassword)}
              >
                <Text>{getHidePassword ? 'Show' : 'Hide'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                getEmail && getPassword
                  ? styles.buttonPrimary
                  : styles.buttonDisabled,
              ]}
              onPress={() => tryLogin()}
              disabled={getLoading || !(getEmail && getPassword)}
            >
              {getLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ChangePasswordComponent', {
                  passedEmail: getEmail,
                })
              }
            >
              <Text style={styles.buttonText}>Forgot password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('RegisterWithMitId')}
            >
              <Text style={styles.buttonText}>Create user</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

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
  logo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
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

export default LoginComponent;
