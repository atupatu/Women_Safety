// App.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// In a real app, you would fetch this data from a server or local file
// For this example, we're importing it directly
import faqData from '../components/data.json';
import Header from '../components/Header';

const FAQItem = ({ item, expanded, onToggle }) => {
  const isHighlighted = item.question === "How can I add friends?";
  
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.faqQuestion} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name="article" 
          size={20} 
          color="#333" 
          style={styles.questionIcon} 
        />
        <Text 
          style={[
            styles.questionText, 
            isHighlighted && styles.highlighted
          ]}
        >
          {item.question}
        </Text>
      </TouchableOpacity>
      
      {expanded && (
        <Text style={styles.answerText}>
          {item.answer}
        </Text>
      )}
      
      <Text style={styles.modifiedText}>
        Modified on {item.modified}
      </Text>
    </View>
  );
};

const faqs = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  
  // Filter FAQs based on search text
  const filteredFAQs = faqData.faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#5a0051" barStyle="light-content" />
      
      {/* Header */}
      <Header />
      
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>Home</Text>
        <Icon name="chevron-forward" size={16} color="#fff" />
        <Text style={styles.breadcrumbText}>Knowledge Base</Text>
        <Icon name="chevron-forward" size={16} color="#fff" />
        <Text style={styles.breadcrumbText}>I'M SAFE WOMEN SAFETY APP</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Find some solutions here..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Title */}
      <View style={styles.titleContainer}>
        <Icon name="folder" size={22} color="#fff" />
        <Text style={styles.title}>FAQ's-I'M SAFE WOMEN SAFETY APP (60)</Text>
      </View>
      
      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          The FAQs provide a comprehensive guide on utilising the features of I'm Safe Women Safety app, offering users a detailed understanding of the platform's functionalities.
        </Text>
      </View>
      
      {/* FAQ List */}
      <ScrollView style={styles.faqList}>
        {filteredFAQs.map(faq => (
          <FAQItem
            key={faq.id}
            item={faq}
            expanded={expandedId === faq.id}
            onToggle={() => toggleExpand(faq.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 30
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    height: 40,
    width: 100,
  },
  breadcrumb: {
    backgroundColor: '#5a0051',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    color: '#fff',
    marginHorizontal: 5,
    fontSize: 13,
  },
  searchContainer: {
    backgroundColor: '#5a0051',
    padding: 15,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#333',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#e8f0fe',
  },
  titleContainer: {
    backgroundColor: '#5a0051',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  descriptionContainer: {
    backgroundColor: '#5a0051',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  description: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
  faqList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  faqQuestion: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  questionIcon: {
    marginRight: 10,
  },
  questionText: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  answerText: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    color: '#555',
    lineHeight: 20,
  },
  modifiedText: {
    paddingHorizontal: 40,
    paddingBottom: 10,
    fontSize: 12,
    color: '#888',
  },
  highlighted: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
});

export default faqs;