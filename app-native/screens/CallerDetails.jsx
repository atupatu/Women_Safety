import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const CallerDetailsScreen = ({ navigation }) => {
  const [activeTimer, setActiveTimer] = useState('5 sec');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Caller Details</Text>
          <Text style={styles.headerSubtitle}>Specify time and caller details to schedule a fake call.</Text>
        </View>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Caller Image Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set up caller image</Text>
        <View style={styles.imageOptions}>
          <View style={styles.imageOptionItem}>
            <TouchableOpacity style={styles.circleButton}>
              <Icon name="photo-library" size={24} style={styles.optionIcon} />
            </TouchableOpacity>
            <Text style={styles.optionLabel}>Gallery</Text>
          </View>
          <View style={styles.imageOptionItem}>
            <TouchableOpacity style={styles.circleButton}>
              <Icon name="grid-view" size={24} style={styles.optionIcon} />
            </TouchableOpacity>
            <Text style={styles.optionLabel}>Preset</Text>
          </View>
          <View style={styles.profilePreview}>
            <View style={styles.profileImage}>
              <Icon name="person" size={40} color="#8B8B8B" />
            </View>
          </View>
        </View>
      </View>
      
      {/* Fake Caller Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set up a fake caller</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#8B8B8B"
          />
          <TouchableOpacity style={styles.contactIcon}>
            <FeatherIcon name="users" size={20} color="#555555" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter number"
            placeholderTextColor="#8B8B8B"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      {/* Timer Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pre-set timer</Text>
        <View style={styles.timerRow}>
          <TouchableOpacity 
            style={[
              styles.timerButton, 
              activeTimer === '5 sec' && styles.activeTimerButton
            ]}
            onPress={() => setActiveTimer('5 sec')}
          >
            <Text 
              style={[
                styles.timerText, 
                activeTimer === '5 sec' && styles.activeTimerText
              ]}
            >
              5 sec
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.timerButton, 
              activeTimer === '10 sec' && styles.activeTimerButton
            ]}
            onPress={() => setActiveTimer('10 sec')}
          >
            <Text 
              style={[
                styles.timerText, 
                activeTimer === '10 sec' && styles.activeTimerText
              ]}
            >
              10 sec
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timerRow}>
          <TouchableOpacity 
            style={[
              styles.timerButton, 
              activeTimer === '1 min' && styles.activeTimerButton
            ]}
            onPress={() => setActiveTimer('1 min')}
          >
            <Text 
              style={[
                styles.timerText, 
                activeTimer === '1 min' && styles.activeTimerText
              ]}
            >
              1 min
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.timerButton, 
              activeTimer === '5 min' && styles.activeTimerButton
            ]}
            onPress={() => setActiveTimer('5 min')}
          >
            <Text 
              style={[
                styles.timerText, 
                activeTimer === '5 min' && styles.activeTimerText
              ]}
            >
              5 min
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  backIcon: {
    marginRight: 15,
    color: '#000000',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B8B8B',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  imageOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageOptionItem: {
    alignItems: 'center',
    marginRight: 25,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionIcon: {
    color: '#555555',
  },
  optionLabel: {
    fontSize: 14,
    color: '#000000',
  },
  profilePreview: {
    marginLeft: 'auto',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1EFF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  contactIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#F5F5F5',
    padding: 5,
    borderRadius: 5,
  },
  timerRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timerButton: {
    flex: 1,
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeTimerButton: {
    backgroundColor: '#EC407A',
    borderColor: '#EC407A',
  },
  timerText: {
    fontSize: 16,
    color: '#8B8B8B',
  },
  activeTimerText: {
    color: '#FFFFFF',
  },
  saveButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: '#4A154B',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CallerDetailsScreen;
