import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useSocket } from "./SocketContext";

const Header = () => {
    const router = useRouter();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!socket) return;
    
        const handleSharingEnded = (data) => {
            setNotifications((prev) => [...prev, data]);
        };
    
        socket.on("sharingEnded", handleSharingEnded);
    
        return () => {
            socket.off("sharingEnded", handleSharingEnded);
        };
    }, [socket]);

    const handleNotificationPress = (notification) => {
        setShowModal(false);
        router.push({
            pathname: '/LocationHistory',
            params: { historyData: JSON.stringify(notification.sharingDetails) }
        });
    };

    return (
        <>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <FontAwesome5 name="dove" size={24} color="#F94989" />
                    <Text style={styles.headerTitle}>I'M SAFE</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        style={styles.bellButton}
                        onPress={() => setShowModal(true)}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                        {notifications.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{notifications.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => router.push('/menu')} 
                        style={styles.menuButton}
                    >
                        <Ionicons name="menu" size={28} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Notifications</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {notifications.map((notif, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.notificationItem}
                                    onPress={() => handleNotificationPress(notif)}
                                >
                                    <Text style={styles.notifTitle}>
                                        {notif.username} has stopped sharing location
                                    </Text>
                                    <Text style={styles.notifTime}>
                                        Tap to view sharing history
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {notifications.length === 0 && (
                                <Text style={styles.emptyText}>No notifications</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#F94989',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellButton: {
        marginRight: 15,
    },
    menuButton: {
        
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4F93',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    notificationItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    notifTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    notifTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    emptyText: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
    },
});

export default Header;