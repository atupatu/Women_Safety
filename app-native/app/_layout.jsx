import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, Text , StyleSheet } from 'react-native'; // Added View, Text to handle loading
import 'react-native-reanimated';
import { SocketProvider } from '../components/SocketContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SOSProvider } from '../context/SOSContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SOSProvider>
      <SocketProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
          <Stack options={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }}  />
            <Stack.Screen name="ModuleSelection" options={{ headerShown: false }}  />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
            <Stack.Screen name="(tabs2)" options={{ headerShown: false }}  />
            <Stack.Screen name="(tabs3)" options={{ headerShown: false }}  />
            <Stack.Screen name="login" options={{ headerShown: false }}  /> 
            <Stack.Screen name="otp" options={{ headerShown: false }} />
            <Stack.Screen name="chatbot" options={{ headerShown: false }} />
            <Stack.Screen name="RecordingHistory" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="menu" options={{ headerShown: false }} />
            <Stack.Screen name="friends" options={{ headerShown: false }} />
            <Stack.Screen name="help" options={{ headerShown: false }} />
            <Stack.Screen name="faqs" options={{ headerShown: false }} />
            <Stack.Screen name="feedback" options={{ headerShown: false }} />
            <Stack.Screen name="friendLocation" options={{ 
              headerShown: true,
              title: "Friend's Location"
            }} />
            <Stack.Screen name="LocationHistory" options={{ 
              headerShown: true,
              title: "Location History"
            }} />
            <Stack.Screen name="+not-found" />
          </Stack>


          <StatusBar style="auto" />
        </ThemeProvider>
      </SocketProvider>
    </SOSProvider>
  );
}

const styles = StyleSheet.create({
  translateContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 200, // Adjust the size as needed
    height: 100, // Adjust the size as needed
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  translateWebView: {
    flex: 1,
  },
});
