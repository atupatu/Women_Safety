
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#5D1049" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.emptySpace} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Picture Section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageOuter}>
            <View style={styles.profileImageInner} />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Feather name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* Profile Info Sections */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Name</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoValue}>Vinayak Bhatia</Text>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#5D1049" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Mobile No.</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoValue}>9930679651</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email ID</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoValue}>ntpjc2vinayak@gmail.com</Text>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#5D1049" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Age Group</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoPlaceholder}>Select your age group</Text>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#5D1049" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Location</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoPlaceholder}>Select your location</Text>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#5D1049" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5D1049',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  emptySpace: {
    width: 24,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    position: 'relative',
  },
  profileImageOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FDE7F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5A9C5',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '38%',
    backgroundColor: 'white',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 22,
  },
  infoLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  infoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
    paddingBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#5D1049',
    fontWeight: '500',
  },
  infoPlaceholder: {
    fontSize: 16,
    color: '#CCC',
  },
  editButton: {
    padding: 4,
  },
  bottomIndicator: {
    height: 5,
    width: 60,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
});

export default ProfileScreen;

