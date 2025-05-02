import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const LocationSharingBox = ({ sharingUser, location }) => {
  const router = useRouter();

  const viewLocation = () => {
    router.push({
      pathname: '/friendLocation',
      params: { 
        userName: sharingUser,
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={viewLocation}>
      <View style={styles.content}>
        <MaterialIcons name="location-on" size={24} color="#FF4F93" />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{sharingUser}</Text>
          <Text style={styles.sharingText}>is sharing their location</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sharingText: {
    color: '#666',
    fontSize: 14,
  },
});

export default LocationSharingBox;
