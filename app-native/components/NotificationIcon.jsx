import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSocket } from './SocketContext';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("sharingEnded", (data) => {
      setNotifications(prev => [...prev, data]);
    });

    return () => {
      if (socket) {
        socket.off("sharingEnded");
      }
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
    <View>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.iconContainer}>
        <Ionicons name="notifications" size={24} color="#333" />
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>

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
                    View sharing history
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
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
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

export default NotificationIcon;
