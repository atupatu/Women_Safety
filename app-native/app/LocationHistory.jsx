import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function LocationHistory() {
  const params = useLocalSearchParams();
  const historyData = JSON.parse(params.historyData);

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = endTime - startTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Location Sharing History</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Start Time:</Text>
        <Text style={styles.value}>{new Date(historyData.startTime).toLocaleString()}</Text>
        
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>
          {calculateDuration(historyData.startTime, historyData.endTime)}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: historyData.locations[0].latitude,
            longitude: historyData.locations[0].longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {historyData.locations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={loc.placeName}
              description={new Date(loc.timestamp).toLocaleTimeString()}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.locationsList}>
        <Text style={styles.subtitle}>Location Timeline</Text>
        {historyData.locations.map((loc, index) => (
          <View key={index} style={styles.locationItem}>
            <Text style={styles.placeName}>{loc.placeName}</Text>
            <Text style={styles.timestamp}>
              {new Date(loc.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  mapContainer: {
    height: 300,
    margin: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  locationsList: {
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  locationItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
