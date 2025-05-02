import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProfileSelectionScreen = () => {
  const router = useRouter();
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [gradientAnim]);

  const backgroundColor = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F3F9FF', '#EEFAFF']
  });

  const modules = [
    { 
      id: '1', 
      name: 'Personal Safety', 
      color: '#FF3A5A',
      image: require('../assets/images/safety-icon.png'),
      route: '/(tabs)'
    },
    { 
      id: '2', 
      name: 'Financial Literacy', 
      color: '#20A4F3',
      image: require('../assets/images/literacy-icon.png'),
      route: '/(tabs2)'
    },
    { 
      id: '3', 
      name: 'Skill Development', 
      color: '#7B61FF',
      image: require('../assets/images/development-icon.png'),
      route: '/(tabs3)'
    },
  ];

  const handleModuleSelect = (moduleId) => {
    const selectedModule = modules.find(module => module.id === moduleId);
    if (selectedModule) {
      router.push(selectedModule.route);
    }
  };

  const handleAddProfile = () => {
    // Navigate to create profile screen
    router.push('/create-profile');
  };

  const handleEditProfile = () => {
    // Navigate to edit profiles screen
    router.push('/edit-profiles');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background gradient */}
      <Animated.View style={[styles.backgroundGradient, { backgroundColor }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Profile</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profilesContainer}>
        {modules.map(module => (
          <TouchableOpacity 
            key={module.id}
            style={styles.profileItem}
            onPress={() => handleModuleSelect(module.id)}
          >
            <LinearGradient
              colors={[module.color, module.color + 'CC']}
              style={styles.avatarContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={module.image} style={styles.avatar} />
            </LinearGradient>
            <Text style={styles.profileName}>{module.name}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.addProfileItem}
          onPress={handleAddProfile}
        >
          <LinearGradient
            colors={['#F2F2F2', '#E6E6E6']}
            style={styles.addAvatarContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addIcon}>+</Text>
          </LinearGradient>
          <Text style={styles.addProfileText}>Add Profile</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 24,
  },
  title: {
    color: '#333333',
    fontSize: 20,
    fontWeight: '600',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    color: '#333333',
    fontSize: 24,
  },
  profilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    zIndex: 1,
  },
  profileItem: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    width: 100,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  profileName: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  addProfileItem: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  addAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addIcon: {
    color: '#666666',
    fontSize: 40,
  },
  addProfileText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1,
  },
  editButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSelectionScreen;