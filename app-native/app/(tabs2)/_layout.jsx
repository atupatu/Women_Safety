import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, Linking, Vibration, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { useSOSContext } from '../../context/SOSContext';
import { LinearGradient } from 'expo-linear-gradient';
let Contacts;
try {
  Contacts = require('expo-contacts');
} catch (error) {
  console.warn('expo-contacts module not available');
}

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#5E60CE',
          tabBarInactiveTintColor: '#999',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarLabel: 'Wallet',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="account-balance-wallet" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#5E60CE', '#4EA8DE']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 75,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#5E60CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 100,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
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


