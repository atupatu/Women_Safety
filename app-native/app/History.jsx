import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationHistoryList() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = 'https://normal-joint-hamster.ngrok-free.app';  // Replace with your API URL

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      // Get user data from AsyncStorage
      const userDataStr = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataStr);

      if (!userData || !userData._id) {
        throw new Error('User data not found');
      }

      const response = await fetch(`${url}/api/history/${userData._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      // Sort histories by date (most recent first)
      const sortedHistories = data.sort((a, b) => 
        new Date(b.startTime) - new Date(a.startTime)
      );
      
      setHistories(sortedHistories);
      setError(null);
    } catch (err) {
      console.error('Error fetching history data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetail = (historyData) => {
    // Convert to string for passing as a parameter
    router.push({
      pathname: '/LocationHistory',
      params: { historyData: JSON.stringify(historyData) }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = endTime - startTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const renderHistoryItem = ({ item }) => {
    const locationCount = item.locations ? item.locations.length : 0;
    const mostRecentLocation = item.locations && item.locations.length > 0 
      ? item.locations[item.locations.length - 1].placeName 
      : 'Unknown location';

    return (
      <TouchableOpacity 
        style={styles.historyCard}
        onPress={() => navigateToDetail(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{formatDate(item.startTime)}</Text>
          {item.isActive && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.timeText}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
          
          <View style={styles.durationContainer}>
            <Ionicons name="hourglass-outline" size={16} color="#555" />
            <Text style={styles.durationText}>
              {calculateDuration(item.startTime, item.endTime)}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.locationText}>
              {locationCount} locations • Last: {mostRecentLocation}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={18} color="#007AFF" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchHistories}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Location History</Text>
      </View>

      {histories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No location history found</Text>
          <Text style={styles.emptySubtext}>Your location sharing history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={histories}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  activeIndicator: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});