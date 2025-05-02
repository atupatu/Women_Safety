import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const TrackMeScreen = () => {
  const [location, setLocation] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>02:03</Text>
        <FontAwesome name="whatsapp" size={20} color="black" />
        <View style={styles.statusBarRight}>
          <View style={styles.locationIndicator}>
            <Icon name="location-on" size={16} color="black" />
            <Text style={styles.kbpsText}>189 KB/S</Text>
          </View>
          <Ionicons name="wifi" size={20} color="black" />
          <Ionicons name="call-outline" size={18} color="black" />
          <Icon name="signal-cellular-alt" size={18} color="black" />
          <FontAwesome name="battery-full" size={20} color="black" />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Icon name="favorite" size={30} color="#FF4F93" />
          <Text style={styles.logoText}>I'M SAFE</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Icon name="menu" size={30} color="black" style={styles.menuIcon} />
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Track me</Text>
        <Text style={styles.subtitle}>
          Share live location with your friends
        </Text>
      </View>
      
      {/* Add Friend Section */}
      <View style={styles.addFriendSection}>
        <View>
          <Text style={styles.addFriendTitle}>Add Friend</Text>
          <Text style={styles.addFriendSubtitle}>
            Add a friend to use SOS and Track me
          </Text>
        </View>
        <TouchableOpacity style={styles.addFriendsButton}>
          <Text style={styles.addFriendsButtonText}>Add friends</Text>
        </TouchableOpacity>
      </View>
      
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }}
          >
            <View style={styles.markerContainer}>
              <Icon name="location-on" size={30} color="black" />
            </View>
          </Marker>
        </MapView>
        
        {/* Location Button */}
        <View style={styles.locationButtonContainer}>
          <TouchableOpacity style={styles.locationButton}>
            <Icon name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* Track Me Button */}
        <TouchableOpacity style={styles.trackMeButton}>
          <Text style={styles.trackMeButtonText}>Track me</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Icon name="location-on" size={24} color="#FF4F93" />
          <Text style={[styles.navText, styles.activeNavText]}>Track Me</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="record-circle-outline" size={24} color="black" />
          <Text style={styles.navText}>Record</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sosButton}>
          <FontAwesome name="warning" size={24} color="white" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.navText}>Fake Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="help-circle-outline" size={24} color="black" />
          <Text style={styles.navText}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  timeText: {
    marginRight: 10,
  },
  statusBarRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  kbpsText: {
    marginLeft: 2,
    fontSize: 12,
  },
  batteryText: {
    marginLeft: 2,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#FF4F93',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 15,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  addFriendSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  addFriendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addFriendSubtitle: {
    fontSize: 14,
    color: '#888',
    maxWidth: 200,
  },
  addFriendsButton: {
    backgroundColor: '#4E1158',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  locationButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  trackMeButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FF4F93',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  trackMeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4F93',
  },
  activeNavText: {
    color: '#FF4F93',
  },
  sosButton: {
    backgroundColor: '#FF4F93',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sosText: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
});

export default TrackMeScreen;