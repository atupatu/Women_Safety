import React from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useSOSContext } from '../context/SOSContext';

export const triggerSOS = async (setIsSOSActive) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required for SOS');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const response = await fetch('https://normal-joint-hamster.ngrok-free.app/api/sos/trigger', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: 'JohnDoe',
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      })
    });

    const data = await response.json();
    if (data.success) {
      setIsSOSActive(true);
      Alert.alert(
        'SOS Activated',
        'Emergency contacts have been notified. Enter the security code sent to them to deactivate SOS mode.'
      );
    } else {
      Alert.alert('Error', data.message || 'Failed to trigger SOS');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to trigger SOS');
  }
};

const TriggerSOS = () => {
  const { setIsSOSActive } = useSOSContext();

  return { triggerSOS: () => triggerSOS(setIsSOSActive) };
};

export default TriggerSOS;
