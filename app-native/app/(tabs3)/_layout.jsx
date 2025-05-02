import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, Linking, Vibration, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { useSOSContext } from '../../context/SOSContext';
let Contacts;
try {
  Contacts = require('expo-contacts');
} catch (error) {
  console.warn('expo-contacts module not available');
}


export default function TabLayout() {

  
return (
  <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#EC4571',
      tabBarInactiveTintColor: 'black',
      tabBarItemStyle: {
        paddingVertical: 5,
      },
      // Disable tab press when SOS is active
      tabBarButton: (props) => (
        <TouchableOpacity
          {...props}
          style={[
            props.style,
            {opacity: 0.5}
          ]}
        />
      ),
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: ''
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
  height: 75,
  paddingBottom: 20,
  paddingTop: 2,
},
tabItem: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 5,
  height: 60,
},
tabLabel: {
  fontSize: 12,
  color: 'black',
  marginTop: 1,
},
sosButton: {
  width: 55,
  height: 55,
  borderRadius: 27.5,
  backgroundColor: '#FF4259',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
sosText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},
});


