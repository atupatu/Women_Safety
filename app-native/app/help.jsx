
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const NationalNumbersScreen = () => {
    const router = useRouter();
  const emergencyNumbers = [
    {
      id: '1',
      number: '112',
      service: 'National helpline',
      color: '#E8F5E9',
      textColor: '#4CAF50',
      icon: 'phone',
      iconType: 'FontAwesome',
      additionalIcon: 'medical-services',
      additionalIconType: 'MaterialIcons',
      additionalIconColor: '#F44336',
    },
    {
      id: '2',
      number: '108',
      service: 'Ambulance',
      color: '#E3F2FD',
      textColor: '#2196F3',
      icon: 'ambulance',
      iconType: 'FontAwesome5',
    },
    {
      id: '3',
      number: '102',
      service: 'Pregnancy Medic',
      color: '#FCE4EC',
      textColor: '#E91E63',
      icon: 'baby',
      iconType: 'FontAwesome5',
      additionalIcon: 'heart',
      additionalIconType: 'FontAwesome',
      additionalIconColor: '#E91E63',
    },
    {
      id: '4',
      number: '101',
      service: 'Fire Service',
      color: '#FFF8E1',
      textColor: '#FF9800',
      icon: 'fire-truck',
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: '5',
      number: '100',
      service: 'Police',
      color: '#E3F2FD',
      textColor: '#2196F3',
      icon: 'police-badge',
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: '6',
      number: '1091',
      service: 'Women helpline',
      color: '#FFF8E1',
      textColor: '#795548',
      icon: 'people',
      iconType: 'MaterialIcons',
    },
    {
      id: '7',
      number: '1098',
      service: 'Child Helpline',
      color: '#E3F2FD',
      textColor: '#2196F3',
      icon: 'child-care',
      iconType: 'MaterialIcons',
    },
    
      {
        "id": "8",
        "number": "1073",
        "service": "Road Accident",
       "color": "#FFCDD2",
    "textColor": "#D32F2F",
    "icon": "local-hospital",
    "iconType": "MaterialIcons"
      },
      {
        "id": "9",
        "number": "182",
        "service": "Railway Protection",
       "color": "#BDBDBD",
    "textColor": "#424242",
    "icon": "train",
    "iconType": "MaterialIcons"
      },
  
    
    
  ];

  const renderIcon = (item) => {
    switch (item.iconType) {
      case 'FontAwesome':
        return <FontAwesome name={item.icon} size={30} color={item.textColor} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={item.icon} size={30} color={item.textColor} />;
      case 'Ionicons':
        return <Ionicons name={item.icon} size={30} color={item.textColor} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={item.icon} size={30} color={item.textColor} />;
      default:
        return <Icon name={item.icon} size={30} color={item.textColor} />;
    }
  };

  const renderAdditionalIcon = (item) => {
    if (!item.additionalIcon) return null;
    
    switch (item.additionalIconType) {
      case 'FontAwesome':
        return (
          <View style={styles.additionalIconContainer}>
            <FontAwesome name={item.additionalIcon} size={15} color={item.additionalIconColor || item.textColor} />
          </View>
        );
      case 'MaterialIcons':
        return (
          <View style={styles.additionalIconContainer}>
            <Icon name={item.additionalIcon} size={15} color={item.additionalIconColor || item.textColor} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>National Numbers</Text>
          <Text style={styles.headerSubtitle}>
            In case of an emergency, call an appropriate number for help.
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* Emergency Numbers List */}
      <ScrollView style={styles.scrollView}>
        {emergencyNumbers.map((item) => (
          <View 
            key={item.id} 
            style={[styles.emergencyCard, { backgroundColor: item.color }]}
          >
            <View style={styles.cardLeftContent}>
              <View style={styles.iconContainer}>
                {renderIcon(item)}
                {renderAdditionalIcon(item)}
              </View>
              <View style={styles.numberInfoContainer}>
                <Text style={[styles.emergencyNumber, { color: item.textColor }]}>
                  {item.number}
                </Text>
                <Text style={[styles.serviceName, { color: item.textColor }]}>
                  {item.service}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.number}`)} style={styles.callButton}>
              <Icon name="call" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emergencyCard: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalIconContainer: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  numberInfoContainer: {
    marginLeft: 14,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 16,
    marginTop: 2,
  },
  callButton: {
    backgroundColor: '#000000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NationalNumbersScreen;