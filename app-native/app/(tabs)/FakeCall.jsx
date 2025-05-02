import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';

const FakeCallScreen = () => {
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [showWarning, setShowWarning] = useState(true);
  const [calls, setCalls] = useState([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const url = 'https://normal-joint-hamster.ngrok-free.app';
  const router = useRouter();

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async() => {
    try {
      const userStr = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userStr);
      if (!user || !user._id) {
        throw new Error('User data not found');
      }
      const response = await fetch(`${url}/api/get/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get caller details');
      }
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const handleSetCaller = async() => {
    try {
      const userStr = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userStr);
      if (!user || !user._id) {
        throw new Error('User data not found');
      }
      const response = await fetch(`${url}/api/save/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: callerName, phone: callerPhone }),
      });
      if (!response.ok) {
        throw new Error('Failed to save caller details');
      }
      fetchCalls();
      setSelectedContact({ name: callerName, phone: callerPhone });
    } catch (e) {
      console.error('Error saving caller:', e);
      alert('Failed to save caller details');
    }
    setFormModalVisible(false);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setCallerName(contact.name);
    setCallerPhone(contact.phone);
  };

  const handleStartCall = () => {
    if (selectedContact) {
      router.push({
        pathname: '/call',
        params: { 
          name: selectedContact.name, 
          phone: selectedContact.phone 
        }
      });
    } else if (callerName && callerPhone) {
      router.push({
        pathname: '/call',
        params: { 
          name: callerName, 
          phone: callerPhone 
        }
      });
    } else {
      alert('Please select or set a caller first');
    }
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.contactItem, 
        selectedContact && selectedContact.phone === item.phone ? styles.selectedContact : null
      ]}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.contactAvatar}>
        <Icon name="person" size={24} color="#fff" />
      </View>
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      {selectedContact && selectedContact.phone === item.phone && (
        <Icon name="check-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.safeArea} />
      {/* Header */}
      <Header />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Fake Call</Text>
        <Text style={styles.subtitle}>
          Place a fake phone call and pretend you are talking to someone.
        </Text>
        
        {/* Caller Details Button */}
        <View style={styles.callerDetailsContainer}>
          <View style={styles.callerDetailsContent}>
            <Text style={styles.callerDetailsTitle}>Caller Details</Text>
            <Text style={styles.callerDetailsText}>
              {selectedContact 
                ? `${selectedContact.name} (${selectedContact.phone})` 
                : callerName && callerPhone 
                  ? `${callerName} (${callerPhone})` 
                  : "No caller details set"}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setFormModalVisible(true)}
          >
            <Icon name="edit" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Saved Contacts Section */}
        <View style={styles.savedContactsSection}>
          <Text style={styles.sectionTitle}>Saved Contacts</Text>
          {calls.length > 0 ? (
            <FlatList
              data={calls}
              renderItem={renderContactItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.contactsList}
            />
          ) : (
            <Text style={styles.noContactsText}>No saved contacts</Text>
          )}
        </View>
        
        {/* Caller Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={formModalVisible}
          onRequestClose={() => setFormModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Caller Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter caller name"
                  value={callerName}
                  onChangeText={setCallerName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  value={callerPhone}
                  onChangeText={setCallerPhone}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setFormModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.setButton]}
                  onPress={handleSetCaller}
                >
                  <Text style={styles.setButtonText}>Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Warning Popup */}
        {showWarning && (
          <View style={styles.warningContainer}>
            <View style={styles.warningIcon}>
              <Icon name="warning" size={24} color="#FFB700" />
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Warning!</Text>
              <Text style={styles.warningText}>
                Add atleast one friend as SOS contact to start SOS
              </Text>
            </View>
          </View>
        )}
        
        {/* Call Button */}
        <TouchableOpacity onPress={handleStartCall} style={styles.callButton}>
          <Text style={styles.callButtonText}>Start Call</Text>
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
  safeArea: {
    height: StatusBar.currentHeight || 47,
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
  kbpsText: {
    marginRight: 5,
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  callerDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  callerDetailsContent: {
    flex: 1,
  },
  callerDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callerDetailsText: {
    fontSize: 16,
    color: '#888',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#FFB700',
  },
  warningIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 16,
    color: '#444',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  setButton: {
    backgroundColor: '#4CAF50',
  },
  setButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FakeCallScreen;