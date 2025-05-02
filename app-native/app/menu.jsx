import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { 
  Feather, 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Entypo
} from '@expo/vector-icons';
import Header from '../components/Header';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';

const handleShareApp = async () => {
    const appUrl = 'https://play.google.com/store/apps/your-app-url';
    try {
        const result = await Share.share({
            message: `Check out this amazing safety app! ${appUrl}`,
            url: appUrl,
            title: 'Share Safety App'
        }, {
            dialogTitle: 'Share Safety App',
            excludedActivityTypes: []
        });
        
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                console.log('Shared with activity type:', result.activityType);
            } else {
                console.log('Shared successfully');
            }
        } else if (result.action === Share.dismissedAction) {
            console.log('Share dismissed');
        }
    } catch (error) {
        Alert.alert('Error', error.message);
    }
};

const SafetyApp = () => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [emergencyContact, setEmergencyContact] = useState('');
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [user, setUser] = useState();
    const url = 'https://normal-joint-hamster.ngrok-free.app';

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            router.replace('/');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'Failed to log out');
        }
    };

    useEffect(() => {
        fetchEmergencyContacts();
    }, []);

    const fetchEmergencyContacts = async () => {
        const userStr = await AsyncStorage.getItem('userData');
        const user = JSON.parse(userStr);
        setUser(user);
        try {
            if (!user) {
                Alert.alert('Error', 'User data not found');
                return;
            }
            const res = await fetch(`${url}/api/emergency/${user._id}`);
            if (res.ok) {
                const data = await res.json();
                setEmergencyContacts(Array.isArray(data) ? data : []);
            } else {
                Alert.alert('Error', 'Failed to fetch emergency contacts');
            }
        } catch (error) {
            console.error('Error fetching emergency contacts:', error);
            Alert.alert('Error', 'An error occurred while fetching emergency contacts');
        }
    };

    const handleSubmit = async () => { 
        const userStr = await AsyncStorage.getItem('userData');
        const user = JSON.parse(userStr);
        if (!emergencyContact || !/^\d+$/.test(emergencyContact)) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }
        try {
            if (!user) {
                Alert.alert('Error', 'User data not found');
                return;
            }
            const res = await fetch(`${url}/api/emergency`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id, phone: emergencyContact })
            });
            if (res.ok) {
                Alert.alert('Success', 'Emergency contact has been submitted successfully!');
                setEmergencyContact('');
                setModalVisible(false);
                fetchEmergencyContacts();
            } else {
                Alert.alert('Error', 'Failed to submit emergency contact');
            }
        } catch (error) {
            console.error('Error submitting emergency contact:', error);
            Alert.alert('Error', 'An error occurred while submitting emergency contact');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#4A0D42" barStyle="light-content" />
            
            <Header />

            <ScrollView style={styles.contentContainer}>
                <View style={styles.profileCard}>
                    <View style={styles.profileInfo}>
                        <View style={styles.profilePic}>
                            <AntDesign name="user" size={40} color="#F5A9C5" />
                        </View>
                        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileText}>
                            <Text style={styles.profileName}>{user?.name || 'Vinayak Bhatia'}</Text>
                            <Text style={styles.profilePhone}>{user?.phone || '+91 9930679651'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Feather name="edit-2" size={20} color="#4A0D42" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sosCard}>
                    <View style={styles.sosHeader}>
                        <View style={styles.sosTitle}>
                            <MaterialIcons name="device-unknown" size={24} color="#4A0D42" />
                            <Text style={styles.sosText}>SOS Device</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="information-circle-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.sosStatus}>
                        {deviceInfo ? (
                            <View style={styles.deviceContainer}>
                                <View style={styles.deviceInfo}>
                                    <Feather name="smartphone" size={24} color="#4A0D42" />
                                    <View style={styles.deviceDetails}>
                                        <Text style={styles.deviceName}>{deviceInfo.name}</Text>
                                        <Text style={styles.devicePhone}>{deviceInfo.phone}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.disconnectButton} onPress={() => setDeviceInfo(null)}>
                                    <Text style={[styles.connectButtonText, { color: '#ff4444' }]}>Disconnect</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.noDeviceContainer}>
                                <Feather name="smartphone" size={24} color="#4A0D42" />
                                <View style={styles.deviceDetails}>
                                    {emergencyContacts.length > 0 ? (
                                        <View>
                                            <Text style={styles.deviceName}>Emergency Contact</Text>
                                            <Text style={styles.devicePhone}>{emergencyContacts[0].phone}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.noDeviceText}>No emergency contacts</Text>
                                    )}
                                </View>
                            </View>
                        )}
                        
                        <View style={styles.connectContainer}>
                            <View style={styles.bellIconContainer}>
                                <Ionicons name="notifications-outline" size={20} color="#4A0D42" />
                            </View>
                            <TouchableOpacity style={styles.connectButton} onPress={() => setModalVisible(true)}>
                                <Text style={styles.connectButtonText}>Add Contact</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.contactsContainer}>
                    <Text style={styles.contactsTitle}>Emergency Contacts</Text>
                    {Array.isArray(emergencyContacts) && emergencyContacts.length > 0 ? (
                        emergencyContacts.map((contact, index) => (
                            <View key={index} style={styles.contactItem}>
                                <Text style={styles.contactName}>{contact.name || 'Contact'}</Text>
                                <Text style={styles.contactPhone}>{contact.phone}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noContactsText}>No contacts found</Text>
                    )}
                </View>

                <View style={styles.menuGrid}>
                    <View style={styles.menuRow}>
                        <MenuTile 
                            icon={<MaterialIcons name="history" size={24} color="#4A0D42" />} 
                            title="History" 
                            onPress={() => router.push('/History')} 
                        />
                        <MenuTile 
                            icon={<MaterialCommunityIcons name="hand-clap" size={24} color="#4A0D42" />} 
                            title="Friends" 
                            onPress={() => router.push('/friends')} 
                        />
                        <MenuTile 
                            icon={<MaterialIcons name="feedback" size={24} color="#4A0D42" />} 
                            title="Feedback" 
                            onPress={() => router.push('/feedback')} 
                        />
                    </View>
                    
                    <View style={styles.menuRow}>
                        <MenuTile 
                            icon={<MaterialIcons name="help-outline" size={24} color="#4A0D42" />} 
                            title="Help" 
                            onPress={() => router.push('/faqs')} 
                        />
                        <MenuTile 
                            icon={<MaterialIcons name="translate" size={24} color="#4A0D42" />} 
                            title="Language"
                            onPress={() => router.push('/language')} 
                        />
                        <MenuTile 
                            icon={<Ionicons name="settings-outline" size={24} color="#4A0D42" />} 
                            title="Settings" 
                            onPress={() => router.push('/settings')} 
                        />
                    </View>
                    
                    <View style={styles.menuRow}>
                        <MenuTile 
                            icon={<Ionicons name="call-outline" size={24} color="#4A0D42" />} 
                            title="Helpline" 
                            onPress={() => router.push('/help')} 
                        />
                        <MenuTile 
                            icon={<Entypo name="share" size={24} color="#4A0D42" />} 
                            title="Share App" 
                            onPress={handleShareApp} 
                        />
                        <MenuTile 
                            icon={<MaterialIcons name="logout" size={24} color="#4A0D42" />} 
                            title="Log Out" 
                            onPress={handleLogout} 
                        />
                    </View>
                </View>
            </ScrollView>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Emergency Contact</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter emergency contact number"
                            value={emergencyContact}
                            onChangeText={setEmergencyContact}
                            keyboardType="phone-pad"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.homeIndicator}>
                <View style={styles.homeIndicatorBar} />
            </View>
        </SafeAreaView>
    );
};

const MenuTile = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuTile} onPress={onPress}>
        <View style={styles.menuIconContainer}>
            {icon}
        </View>
        <Text style={styles.menuTitle}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4A0D42',
        marginTop: 35,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FDE2E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        marginLeft: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    profilePhone: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    sosCard: {
        backgroundColor: 'white',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
    },
    sosHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sosTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sosText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
        color: '#333',
    },
    sosStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noDeviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noDeviceText: {
        marginLeft: 10,
        color: '#777',
    },
    connectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    connectButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#4A0D42',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    connectButtonText: {
        color: '#4A0D42',
        fontWeight: '500',
    },
    contactsContainer: {
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    contactsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A0D42',
        marginBottom: 10,
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    contactName: {
        fontSize: 16,
        color: '#333',
    },
    contactPhone: {
        fontSize: 14,
        color: '#777',
    },
    menuGrid: {
        padding: 8,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuTile: {
        backgroundColor: 'white',
        width: '31%',
        aspectRatio: 1,
        margin: 4,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    menuIconContainer: {
        marginBottom: 10,
    },
    menuTitle: {
        color: '#4A0D42',
        fontSize: 14,
        textAlign: 'center',
    },
    homeIndicator: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    homeIndicatorBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4A0D42',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        width: '100%',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    submitButton: {
        backgroundColor: '#4A0D42',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    deviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginRight: 10,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deviceDetails: {
        marginLeft: 10,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    devicePhone: {
        fontSize: 14,
        color: '#777',
    },
    disconnectButton: {
        borderWidth: 1,
        borderColor: '#ff4444',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    noContactsText: {
        color: '#777',
        textAlign: 'center',
        paddingVertical: 10,
    },
});

export default SafetyApp;