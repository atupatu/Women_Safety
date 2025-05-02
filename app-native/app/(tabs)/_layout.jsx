import { Tabs, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, Linking, Vibration, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { useSOSContext } from '../../context/SOSContext';
import * as Network from 'expo-network';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
// import DirectPhoneCall from 'react-native-direct-phone-call';


// Import TriggerSOS as a function
import { triggerSOS } from '../../components/TriggerSOS';

let Contacts;
try {
  Contacts = require('expo-contacts');
} catch (error) {
  console.warn('expo-contacts module not available');
}

const SHAKE_THRESHOLD = 12;
const UPDATE_INTERVAL = 100;
const NETWORK_CHECK_INTERVAL = 10000; // Check network every 10 seconds

export default function TabLayout() {
  const [friends, setFriends] = useState([{
    "id":"2",
    "name":"anushka",
    "phone":"9152602555"
  }]);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const lastShakeTime = useRef(0);
  const {isSOSActive, setIsSOSActive} = useSOSContext();
  const navigation = useNavigation();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(true);
  const [lastNetworkStatus, setLastNetworkStatus] = useState(true);
  const networkCheckInterval = useRef(null);
  const lastSMSSentTime = useRef(0);



  const handleSOSActivated = () => {
    // Show confirmation dialog for calling emergency contacts
    Alert.alert(
      'SOS Activated',
      'SOS has been sent. Do you want to call your emergency contact?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: callEmergencyContacts,
        },
      ],
      { cancelable: true }
    );
  };

  // Function to directly send SMS without user interaction
  const sendNetworkLostSMS = async () => {
    try {
      // Only send SMS if we haven't sent one in the last 5 minutes (300000ms)
      const now = Date.now();
      if (now - lastSMSSentTime.current < 300000) {
        console.log('SMS already sent recently, skipping');
        return;
      }

      if (friends.length === 0 || !friends[0].phone) {
        console.log('No emergency contacts to send SMS to');
        return;
      }

      // Request location permission if not already granted
      let locationStr = "Location not available";
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          if (location) {
            locationStr = `Last known location: ${location.coords.latitude}, ${location.coords.longitude}`;
          }
        }
      } catch (error) {
        console.log('Could not get location:', error);
      }

      // Create message with timestamp
      const message = `ALERT: Network connection lost at ${new Date().toLocaleString()}. ${locationStr}. This is an automated message from the safety app.`;
      
      // Get phone number
      const phoneNumber = friends[0].phone;
      
      // Use Expo's SMS.sendSMSAsync without awaiting - this method opens the SMS app
      // Instead, use a direct SMS library that doesn't require user intervention

      // For apps that will be published, you would use a library like react-native-sms
      // that can send SMS directly without user interaction (requires native modules)
      
      // Using expo-sms, we can only open the SMS app with populated fields
      // This is the best we can do with Expo's managed workflow
      SMS.sendSMSAsync([phoneNumber], message).then(result => {
        console.log('SMS result:', result);
        if (result) {
          lastSMSSentTime.current = now;
        }
      }).catch(error => {
        console.error('Error sending SMS:', error);
      });
      
      // For direct sending without user interaction, you would need to:
      // 1. Eject from the Expo managed workflow
      // 2. Install a native SMS module like react-native-sms
      // 3. Use code like this:
      // 
      // import DirectSms from 'react-native-direct-sms';
      // DirectSms.sendDirectSms(phoneNumber, message).then(() => {
      //   console.log('Direct SMS sent successfully');
      //   lastSMSSentTime.current = now;
      // }).catch(error => {
      //   console.error('Error sending direct SMS:', error);
      // });
      
      console.log('Network lost SMS process initiated');
    } catch (error) {
      console.error('Error in SMS sending process:', error);
    }
  };

  // Function to check network status
  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const connected = networkState.isConnected && networkState.isInternetReachable;
      
      // Update state
      setIsConnected(connected);
      
      // If network was connected before but is now disconnected, send SMS
      if (lastNetworkStatus && !connected) {
        console.log('Network connection lost, sending SMS');
        sendNetworkLostSMS();
      }
      
      // Update last known status
      setLastNetworkStatus(connected);
    } catch (error) {
      console.error('Error checking network status:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

    const subscription = Accelerometer.addListener(detectShake);
    
    // Initial network check
    checkNetworkStatus();
    
    // Set up periodic network checking
    networkCheckInterval.current = setInterval(checkNetworkStatus, NETWORK_CHECK_INTERVAL);
    
    // Request location permissions early
    (async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
      } catch (error) {
        console.log('Error requesting location permissions:', error);
      }
    })();
    
    return () => {
      subscription.remove();
      // Clear interval on unmount
      if (networkCheckInterval.current) {
        clearInterval(networkCheckInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isSOSActive) {
        // Prevent leaving the screen
        e.preventDefault();
        Alert.alert(
          'SOS Active',
          'Please enter security code to deactivate SOS mode',
          [{ text: 'OK' }]
        );
      }
    });

    return unsubscribe;
  }, [isSOSActive, navigation]);

  const fetchFriends = async () => {
    try {
      const dummyContact = { id: '1', name: 'Emergency Contact 1', phone: '9152602555' };

      if (!Contacts) {
        console.warn('Contacts module not available');
        setFriends([dummyContact]);
        return;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setFriends([dummyContact]);
        Alert.alert('Permission Denied', 'Cannot access contacts');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const realContacts = data
        .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phoneNumbers[0].number,
        }));

      // Ensure at least the dummy contact is present
      setFriends([dummyContact, ...realContacts]);
      console.log('Fetched contacts:', [dummyContact, ...realContacts]);

    } catch (error) {
      console.error('Error fetching contacts:', error);
      setFriends([{ id: '1', name: 'Emergency Contact 1', phone: '9152602555' }]);
    }
  };

  const callEmergencyContacts = () => {
    console.log('Emergency Contacts:', friends);

    if (friends.length === 0 || !friends[0].phone) {
      Alert.alert('No emergency contacts', 'Please add emergency contacts in your profile');
      return;
    }

    Vibration.vibrate(500);
    // Modified to directly call without another confirmation since we already confirmed
    const phoneNumber = friends[0].phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const detectShake = ({ x, y, z }) => {
    const now = Date.now();
    const prev = lastAcceleration.current;

    const deltaX = Math.abs(x - prev.x);
    const deltaY = Math.abs(y - prev.y);
    const deltaZ = Math.abs(z - prev.z);

    const accelerationChange = deltaX + deltaY + deltaZ;

    if (now - lastShakeTime.current > 1000 && accelerationChange > SHAKE_THRESHOLD) {
      lastShakeTime.current = now;
      if (!isSOSActive) {
        triggerSOS(setIsSOSActive);
        router.push('/Safety')
      }
    }

    lastAcceleration.current = { x, y, z };
  };

  // Replace your current Tabs component with this:
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarActiveTintColor: '#EC4571',
        tabBarInactiveTintColor: '#555555',
        // Disable tab press when SOS is active
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            disabled={isSOSActive}
            style={[
              props.style,
              isSOSActive && { opacity: 0.5 }
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Track Me',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="location" size={24} color={focused ? "#EC4571" : "#555555"} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -5,
          },
        }}
      />
      <Tabs.Screen
        name="Recordings"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="videocam" size={24} color={focused ? "#EC4571" : "#555555"} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -5,
          },
        }}
      />
      <Tabs.Screen
        name="Safety"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: isConnected ? '#FF4259' : '#FFA500',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 8,
              borderWidth: 3,
              borderColor: 'white',
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
              }}>
                {isConnected ? 'SOS' : 'NO NET'}
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="FakeCall"
        options={{
          title: 'Fake Call',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="call" size={24} color={focused ? "#EC4571" : "#555555"} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -5,
          },
        }}
      />
      <Tabs.Screen
        name="Help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="help-circle" size={24} color={focused ? "#EC4571" : "#555555"} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -5,
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
    height: 60,  // Reduced from 75 to make it more compact
    paddingBottom: 10, // Reduced from 20
    paddingTop: 0,  // Changed from 2
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',  // Make each tab take equal width
    height: 50,
  },
  tabLabel: {
    fontSize: 12,
    color: 'black',
    marginTop: 2,
    textAlign: 'center',
  },
  sosButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF4259',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,  // Move it up to create a floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  networkLostButton: {
    backgroundColor: '#FFA500',
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});