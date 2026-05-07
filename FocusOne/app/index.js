import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E5DB8" />
      </View>
    );
  }
  
  if (isAuthenticated) {
return <Redirect href="/(tabs)/Homescreen" />;  } else {
    return <Redirect href="/(auth)/firstscreen" />;
  }
}