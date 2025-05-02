
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = () => {
  // State for PIN and UI controls
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [focusedInput, setFocusedInput] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  
  
  // Refs for PIN input fields
  const inputRefs = useRef([]);
  
  // Available languages
  const languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', '中文', '日本語', 'हिन्दी'];
  
  // Handle PIN digit input
  const handlePinInput = (value, index) => {
    if (value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Auto focus next input
      if (value !== '' && index < 3) {
        inputRefs.current[index + 1].focus();
        setFocusedInput(index + 1);
      }
    }
  };
  
  // Handle backspace in PIN input
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && pin[index] === '') {
      inputRefs.current[index - 1].focus();
      setFocusedInput(index - 1);
    }
  };
  
  // Handle continue button press
  const handleContinue = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length === 4) {
      Alert.alert('Success', 'PIN entered successfully: ' + enteredPin);
      // In a real app, you would validate the PIN against stored values
    } else {
      Alert.alert('Error', 'Please enter a complete 4-digit PIN');
    }
  };
  
  // Handle forgot password
  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality would be triggered here.');
  };
  
  // Handle language selection
  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with time and status icons */}
      <View style={styles.header}>
        <Text style={styles.timeText}>02:06</Text>
        <View style={styles.headerRightIcons}>
          <FontAwesome name="clock-o" size={16} style={styles.iconMargin} />
          <Text style={styles.smallText}>8.00 KB/S</Text>
          <Feather name="wifi" size={16} style={styles.iconMargin} />
          <MaterialCommunityIcons name="signal-cellular-3" size={16} style={styles.iconMargin} />
          <Ionicons name="battery-full" size={18} />
          <Text style={styles.smallText}>100%</Text>
        </View>
      </View>
      
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Feather name="heart" size={30} color="#f06292" />
          <Text style={styles.logoText}>I'M SAFE</Text>
        </View>
        
        {/* Language Selector */}
        <TouchableOpacity 
          style={styles.languageSelector}
          onPress={() => setShowLanguageModal(true)}
        >
          <Ionicons name="flag-outline" size={20} color="#000" />
          <Text style={styles.languageText}>{selectedLanguage}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      {/* Password Section */}
      <View style={styles.passwordContainer}>
        <Text style={styles.passwordTitle}>Password</Text>
        <Text style={styles.pinInstructions}>Enter 4 digit PIN</Text>
        
        {/* PIN Input Fields */}
        <View style={styles.pinContainer}>
          {pin.map((digit, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.pinInput, 
                focusedInput === index && styles.focusedPinInput
              ]}
              onPress={() => {
                inputRefs.current[index].focus();
                setFocusedInput(index);
              }}
            >
              <TextInput
                style={styles.hiddenInput}
                keyboardType="numeric"
                maxLength={1}
                value={pin[index]}
                onChangeText={(value) => handlePinInput(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                secureTextEntry={!showPin}
                ref={(ref) => inputRefs.current[index] = ref}
              />
              <Text style={styles.pinDigit}>
                {pin[index] ? (showPin ? pin[index] : '|') : ''}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Show Button */}
          <TouchableOpacity 
            style={styles.showButton} 
            onPress={() => setShowPin(!showPin)}
          >
            <Ionicons name={showPin ? "eye" : "eye-off"} size={24} color="#999" />
            <Text style={styles.showText}>Show</Text>
          </TouchableOpacity>
        </View>
        
        {/* Forgot Password Link */}
        <TouchableOpacity 
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      
      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={styles.languageItem}
                  onPress={() => selectLanguage(item)}
                >
                  <Text style={styles.languageItemText}>{item}</Text>
                  {selectedLanguage === item && (
                    <Ionicons name="checkmark" size={20} color="#5d1049" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 12,
    marginHorizontal: 2,
  },
  iconMargin: {
    marginHorizontal: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 60,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f06292',
    marginLeft: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  languageText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  passwordContainer: {
    paddingHorizontal: 40,
  },
  passwordTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pinInstructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  focusedPinInput: {
    borderColor: '#5d1049',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    textAlign: 'center',
  },
  pinDigit: {
    fontSize: 24,
    textAlign: 'center',
  },
  showButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  showText: {
    fontSize: 16,
    color: '#999',
    marginLeft: 5,
  },
  forgotPasswordButton: {
    marginVertical: 15,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#5d1049',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#5d1049',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageItemText: {
    fontSize: 16,
  },
});

export default LoginScreen;

