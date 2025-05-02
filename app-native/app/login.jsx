import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  TextInput,
  Image
} from 'react-native';
import { 
  Feather, 
  FontAwesome5, 
  MaterialIcons
} from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const router = useRouter();
  const url = "http://192.168.94.60:5000"
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          router.push('/ModuleSelection');
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };
    
    checkToken();
  } , [])

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://normal-joint-hamster.ngrok-free.app/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      const data = await response.json();
      await AsyncStorage.setItem('userToken', data.accessToken);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      // Store token and navigate to home screen
      console.log(data);
      router.push('/ModuleSelection');
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="dove" size={24} color="#F94989" />
          <Text style={styles.logoText}>I'M SAFE</Text>
        </View>
        
        <TouchableOpacity style={styles.languageSelector}>
          <Image 
            source={{ uri: 'https://flagcdn.com/w40/gb.png' }} 
            style={styles.flagIcon}
            resizeMode="contain"
          />
          <Text style={styles.languageText}>English</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        
        {/* Email Input */}
        <Text style={styles.inputLabel}>Enter your email</Text>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            keyboardType="email-address"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.inputLabel}>Enter your Password</Text>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            secureTextEntry={true}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>
        
        
        
        
        {/* Continue button */}
        <TouchableOpacity onPress={handleLogin} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.loginLink}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree that you have read and accepted our 
          <Text style={styles.termsLink}> T&Cs </Text> 
          and 
          <Text style={styles.termsLink}> Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: StatusBar.currentHeight || 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F94989',
    marginLeft: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  emailInputContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  emailInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  countrySelector: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  flagButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  phoneWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  prefixText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  continueButton: {
    backgroundColor: '#4A0D42',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#4A0D42',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  termsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#4A0D42',
    fontWeight: '500',
  },
});

export default LoginScreen;