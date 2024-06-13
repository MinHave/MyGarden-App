import { SafeAreaView, Text } from 'react-native';
import auth from '@/store/auth';
import LoginComponent from '@/components/login';
import { useNavigation } from 'expo-router';

export default function SettingsView() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text style={{ color: '#FFF' }}>Settings</Text>
      {!auth.isAuthorized() ? <LoginComponent navigation={navigation} /> : null}
    </SafeAreaView>
  );
}
