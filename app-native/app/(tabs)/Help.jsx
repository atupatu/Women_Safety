import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import { 
  Feather, 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const HelpScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.safeArea} />
      
      {/* Header */}
      <Header />
      
      <ScrollView style={styles.contentContainer}>
        {/* Ask for help section */}
        <View style={styles.helpCard}>
          <Text style={styles.sectionTitle}>Ask for help</Text>
          <Text style={styles.sectionSubtitle}>Reach out to us for help.</Text>
          
          <View style={styles.divider} />
          
          {/* Anonymous Help Option */}
          <View style={styles.helpOption}>
            <View style={styles.optionLeft}>
              <View style={styles.anonymousIconContainer}>
                <FontAwesome name="user-secret" size={24} color="white" />
              </View>
              <View>
                <Text style={styles.optionTitle}>Anonymous Help</Text>
                <Text style={styles.optionSubtitle}>Ask for help privately.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/chatbot')} style={styles.enterButton}>
              <Text style={styles.enterButtonText}>Enter</Text>
            </TouchableOpacity>
          </View>
          
          {/* Open Help Option */}
          <View style={styles.helpOption}>
            <View style={styles.optionLeft}>
              <View style={styles.openHelpIconContainer}>
                <FontAwesome5 name="user-alt" size={24} color="#F94989" />
              </View>
              <View>
                <Text style={styles.optionTitle}>Open Help</Text>
                <Text style={styles.optionSubtitle}>Ask for help openly.</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.enterButton}>
              <Text style={styles.enterButtonText}>Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* How it works section */}
        <View style={styles.helpCard}>
          <Text style={styles.sectionTitle}>How it works?</Text>
          
          {/* Step 1 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Ionicons name="document-text-outline" size={24} color="#F94989" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                Share what you're going through openly or Anonymously
              </Text>
            </View>
          </View>
          
          {/* Connector */}
          <View style={styles.connector} />
          
          {/* Step 2 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Ionicons name="person" size={24} color="#F94989" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                Receive Compassionate Guidance from counsellors
              </Text>
            </View>
          </View>
          
          {/* Connector */}
          <View style={styles.connector} />
          
          {/* Step 3 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <FontAwesome5 name="users" size={20} color="#F94989" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                Access further help from authorities if needed
              </Text>
            </View>
          </View>
        </View>
        
        {/* Note */}
        <Text style={styles.noteText}>
          *Note: Replies take upto 24 hours. For urgent help, contact local authorities.
        </Text>
      </ScrollView>
      
      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    height: StatusBar.currentHeight || 47,
  },
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  helpCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  openHelpIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  enterButton: {
    backgroundColor: '#4A0D42',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  enterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  stepContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  stepIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#F2F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
  },
  connector: {
    width: 2,
    height: 25,
    backgroundColor: '#ccc',
    marginLeft: 22,
  },
  noteText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  homeIndicator: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  homeIndicatorBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  }
});

export default HelpScreen;