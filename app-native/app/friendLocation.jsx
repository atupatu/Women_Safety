import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useSocket } from '../components/SocketContext';

export default function FriendLocationScreen() {
  const params = useLocalSearchParams();
  const { userName } = params;
  const predictedPath = params.predictedPath ? JSON.parse(params.predictedPath) : null;
  
  const [location, setLocation] = useState({
    latitude: parseFloat(params.latitude),
    longitude: parseFloat(params.longitude),
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || predictedPath) return; // Don't listen for updates if showing predicted path

    socket.on("locationUpdate", (data) => {
      if (data.username === userName) {
        setLocation(prev => ({
          ...prev,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        }));
      }
    });

    return () => socket?.off("locationUpdate");
  }, [socket, userName, predictedPath]);

  return (
    <View style={styles.container}>
      {predictedPath && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Showing predicted path</Text>
        </View>
      )}
      
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
      >
        {/* Current/Last Known Location */}
        <Marker
          coordinate={location}
          title={userName}
          description={predictedPath ? "Last known location" : "Current location"}
          pinColor="#FF4F93"
        />

        {/* Predicted Path */}
        {predictedPath?.predictedLocations && (
          <>
            <Polyline
              coordinates={predictedPath.predictedLocations}
              strokeColor="#4E1158"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
            {predictedPath.predictedLocations.map((loc, index) => (
              <Marker
                key={index}
                coordinate={loc}
                title={`Predicted Location ${index + 1}`}
                description={`Time: ${new Date(loc.timestamp).toLocaleTimeString()}`}
                pinColor="#4E1158"
              />
            ))}
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  banner: {
    backgroundColor: '#4E1158',
    padding: 10,
    alignItems: 'center',
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
