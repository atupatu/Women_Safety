import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  Animated,
  Platform,
  Share,
  Button
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';

const RecordingsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [waveformAnimation] = useState(new Animated.Value(0));
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [savedRecordings, setSavedRecordings] = useState([]);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const router = useRouter();
  
  const APP_DIRECTORY = FileSystem.documentDirectory + 'recordings/';
  const API_URL = 'https://normal-joint-hamster.ngrok-free.app';

  // Ensure directory exists
  useEffect(() => {
    const setupDirectory = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(APP_DIRECTORY);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(APP_DIRECTORY, { intermediates: true });
        }
        console.log('Recordings directory location:', APP_DIRECTORY);
        loadSavedRecordings();
      } catch (error) {
        console.log('Error setting up directory:', error);
        alert('Error setting up app directory: ' + error.message);
      }
    };
    
    setupDirectory();
  }, []);

  // Initialize audio permissions
  useEffect(() => {
    const initializeAudioPermissions = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasAudioPermission(status === 'granted');
        if (status !== 'granted') {
          alert('Audio permission is required for recording');
        }
      } catch (error) {
        console.log('Error initializing audio permissions:', error);
        alert('Error initializing audio permissions: ' + error.message);
      }
    };

    initializeAudioPermissions();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(error => 
          console.log('Error stopping recording on unmount:', error)
        );
      }
    };
  }, []);

  // Waveform animation
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveformAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(waveformAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      waveformAnimation.setValue(0);
    }
  }, [isRecording]);

  const loadSavedRecordings = async () => {
    try {
      setLoading(true);
      const recordingsMetadataFile = APP_DIRECTORY + 'metadata.json';
      const metadataInfo = await FileSystem.getInfoAsync(recordingsMetadataFile);
      
      if (metadataInfo.exists) {
        const metadataContent = await FileSystem.readAsStringAsync(recordingsMetadataFile);
        const metadata = JSON.parse(metadataContent);
        setSavedRecordings(metadata);
      } else {
        await FileSystem.writeAsStringAsync(recordingsMetadataFile, JSON.stringify([]));
        setSavedRecordings([]);
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
      alert('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const requestAudioPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasAudioPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.log('Error requesting audio permissions:', error);
      alert('Error requesting audio permissions: ' + error.message);
      return false;
    }
  };

  const getRecordingFilename = () => {
    const timestamp = Date.now();
    return `recording-${timestamp}.m4a`;
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      console.log('Camera reference not available');
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
        width: 640,
        height: 480
      });
      console.log('Photo captured successfully:', photo.uri);
      setPhotoUri(photo.uri);
      return photo.uri;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };

  const startRecording = async () => {
    const audioPermissionsGranted = await requestAudioPermissions();
    if (!audioPermissionsGranted) {
      alert('Please grant audio permissions to continue');
      return;
    }

    if (!cameraPermission?.granted) {
      alert('Please grant camera permissions to continue');
      return;
    }

    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      setIsRecording(true);
      setPhotoUri(null);
      setRecording(null);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording: audioRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(audioRecording);

      // Take photo immediately after starting recording
      const photoUri = await takePhoto();
      if (!photoUri) {
        console.log('Failed to capture photo during recording start');
      }
    } catch (error) {
      console.log('Error starting recording:', error);
      alert('Failed to start recording: ' + error.message);
      setIsRecording(false);
      setRecording(null);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();
      await sound.unloadAsync();
      
      const totalSeconds = Math.floor(status.durationMillis / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      const recordingId = Date.now().toString();
      const recordingDir = `${APP_DIRECTORY}${recordingId}/`;
      await FileSystem.makeDirectoryAsync(recordingDir, { intermediates: true });

      const fileName = getRecordingFilename();
      const newUri = recordingDir + fileName;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri
      });

      let savedPhotoUri = null;
      if (photoUri) {
        const photoName = `photo_${recordingId}.jpg`;
        savedPhotoUri = `${recordingDir}${photoName}`;
        try {
          await FileSystem.moveAsync({
            from: photoUri,
            to: savedPhotoUri
          });
          console.log('Photo saved successfully:', savedPhotoUri);
        } catch (error) {
          console.error('Error saving photo:', error);
          savedPhotoUri = null;
        }
      }
      
      const newRecording = {
        id: recordingId,
        uri: newUri,
        photo: savedPhotoUri,
        date: new Date().toISOString(),
        duration: formattedDuration,
        fileName
      };
      
      const recordingsMetadataFile = APP_DIRECTORY + 'metadata.json';
      const metadataInfo = await FileSystem.getInfoAsync(recordingsMetadataFile);
      
      let updatedRecordings = [newRecording];
      if (metadataInfo.exists) {
        const metadataContent = await FileSystem.readAsStringAsync(recordingsMetadataFile);
        const currentMetadata = JSON.parse(metadataContent);
        updatedRecordings = [...currentMetadata, newRecording];
      }
      
      await FileSystem.writeAsStringAsync(
        recordingsMetadataFile, 
        JSON.stringify(updatedRecordings)
      );
      
      setSavedRecordings(updatedRecordings);
      setPhotoUri(null);
      alert(`Recording saved! Duration: ${formattedDuration}${savedPhotoUri ? ' with photo' : ''}`);
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('Failed to save recording: ' + error.message);
    } finally {
      setRecording(null);
      setIsRecording(false);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
  };

  const shareRecording = async (recordingUri) => {
    try {
      if (Platform.OS === 'android') {
        const shareResult = await Share.share({
          url: recordingUri,
          title: 'Share Recording'
        });
      } else {
        await Sharing.shareAsync(recordingUri);
      }
    } catch (error) {
      console.log('Error sharing recording:', error);
      alert('Could not share recording');
    }
  };

  const handleHistoryPress = () => {
    const recordingsJSON = JSON.stringify(savedRecordings.map(recording => ({
      ...recording,
      uri: recording.uri.startsWith('file://') ? recording.uri : `file://${recording.uri}`,
      photo: recording.photo
    })));
    
    router.push({
      pathname: '/RecordingHistory',
      params: { recordings: recordingsJSON }
    });
  };

  // Camera permission handling
  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to use the camera</Text>
        <Button onPress={requestCameraPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      <CameraView
        style={styles.camera}
        facing="front"
        ref={cameraRef}
      />
      
      <View style={styles.safeArea} />
      
      <Header />
      <View style={styles.header}>
        <View style={styles.safeArea} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Recordings</Text>
          <Text style={styles.headerSubtitle}>Detailed history of the recorded event</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.historyButton}
        onPress={handleHistoryPress}
      >
        <View style={styles.recordingItemContent}>
          <View style={styles.recordingIconContainer}>
            <FontAwesome5 name="history" size={22} color="white" />
          </View>
          <View style={styles.recordingDetails}>
            <Text style={styles.historyButtonText}>Recording History</Text>
            <Text style={styles.recordingCount}>{savedRecordings.length} recordings saved</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </TouchableOpacity>
      
      <View style={styles.mainContent}>
        {isRecording && (
          <View style={styles.waveformContainer}>
            {[...Array(5)].map((_, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.waveformLine,
                  { 
                    height: waveformAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 40 + index * 5]
                    })
                  }
                ]}
              />
            ))}
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.recordButton, isRecording ? styles.recordingButtonActive : {}]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={loading || !hasAudioPermission || !cameraPermission.granted}
        >
          <View style={[styles.recordIcon, isRecording ? styles.recordingActive : styles.recordingInactive]}>
          </View>
          <Text style={styles.recordButtonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.storageInfo}>
          <Text style={styles.storageText}>
            Recordings saved to app's document directory
          </Text>
        </View>
      </View>
      
      <View style={styles.bottomIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    height: StatusBar.currentHeight || 47,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  recordingCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recordingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recordingDetails: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingButtonActive: {
    backgroundColor: '#d32f2f',
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  recordingInactive: {
    backgroundColor: '#f44336',
  },
  recordingActive: {
    backgroundColor: '#ffffff',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
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
  waveformContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    height: 60,
  },
  waveformLine: {
    width: 4,
    marginHorizontal: 4,
    backgroundColor: '#f44336',
    borderRadius: 2,
  },
  storageInfo: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  storageText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 320,
    height: 240,
    opacity: 0,
    zIndex: -1,
  },
});

export default RecordingsScreen;