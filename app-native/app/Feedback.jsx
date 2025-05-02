import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, PanResponder, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FeedbackScreen = () => {
  // State for current feedback
  const [sliderValue, setSliderValue] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  
  // State for previous feedback
  const [previousFeedback, setPreviousFeedback] = useState([]);
  
  // Ref for slider width
  const sliderWidth = useRef(0);
  const sliderRef = useRef(null);
  
  // Calculate the slider position
  const sliderPosition = sliderValue / 100;
  
  // Determine mood based on slider position
  const getMoodType = () => {
    if (sliderPosition < 0.33) return 'Happy';
    if (sliderPosition < 0.66) return 'Unhappy';
    return 'Confused';
  };

  const moodType = getMoodType();
  
  // Handle slider functionality with PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        if (sliderWidth.current === 0) return;
        
        // Calculate new slider value based on touch position
        const newPosition = Math.max(0, Math.min(gestureState.moveX, sliderWidth.current));
        const newValue = (newPosition / sliderWidth.current) * 100;
        setSliderValue(newValue);
      },
      onPanResponderRelease: () => {},
    })
  ).current;
  
  // Measure slider width when component mounts
  const measureSlider = () => {
    if (sliderRef.current) {
      sliderRef.current.measure((x, y, width) => {
        sliderWidth.current = width;
      });
    }
  };
  
  // Handle submitting feedback
  const handleSubmitFeedback = () => {
    if (feedbackText.trim() === '') {
      // Could add validation alert here
      return;
    }
    
    // Create new feedback object
    const newFeedback = {
      id: Date.now().toString(),
      mood: moodType,
      text: feedbackText,
      email: email,
      timestamp: new Date().toLocaleString(),
      sliderValue: sliderValue
    };
    
    // Add to previous feedback array
    setPreviousFeedback([newFeedback, ...previousFeedback]);
    
    // Reset form
    setSliderValue(0);
    setFeedbackText('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A0E4A" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back() } style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Main Question */}
          <Text style={styles.questionText}>How do you feel using our app?</Text>
          
          {/* Mood Icon */}
          <View style={styles.moodIconContainer}>
            <View style={styles.moodIcon}>
              <Ionicons 
                name={moodType === 'Happy' ? 'happy-outline' : moodType === 'Unhappy' ? 'sad-outline' : 'help-outline'} 
                size={50} 
                color="#F06292" 
              />
            </View>
          </View>
          
          {/* Slider */}
          <View 
            style={styles.sliderContainer}
            ref={sliderRef}
            onLayout={measureSlider}
          >
            <View 
              style={styles.sliderTrack}
              {...panResponder.panHandlers}
            >
              <View style={[styles.sliderFill, { width: `${sliderPosition * 100}%` }]} />
              <View 
                style={[styles.sliderThumb, { left: `${sliderPosition * 100}%` }]}
              />
            </View>
            
            {/* Mood Labels */}
            <View style={styles.moodLabelsContainer}>
              <Text style={[styles.moodLabel, moodType === 'Happy' && styles.activeMoodLabel]}>Happy</Text>
              <Text style={[styles.moodLabel, moodType === 'Unhappy' && styles.activeMoodLabel]}>Unhappy</Text>
              <Text style={[styles.moodLabel, moodType === 'Confused' && styles.activeMoodLabel]}>Confused</Text>
            </View>
          </View>
          
          {/* Feedback Text Area */}
          <Text style={styles.sectionTitle}>Tell us more</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={6}
              placeholder="Share your thoughts..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              maxLength={500}
            />
            <Text style={styles.charCount}>{feedbackText.length}/500</Text>
          </View>
          
          {/* Email Field */}
          <Text style={styles.sectionTitle}>Email ID</Text>
          <View style={styles.emailInputContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          
          {/* Send Button */}
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSubmitFeedback}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          
          {/* Previous Feedback Section */}
          {previousFeedback.length > 0 && (
            <View style={styles.previousFeedbackContainer}>
              <Text style={styles.previousFeedbackTitle}>Previous Feedback</Text>
              
              {previousFeedback.map((feedback) => (
                <View key={feedback.id} style={styles.feedbackCard}>
                  <View style={styles.feedbackCardHeader}>
                    <View style={styles.moodBadge}>
                      <Ionicons 
                        name={feedback.mood === 'Happy' ? 'happy-outline' : 
                              feedback.mood === 'Unhappy' ? 'sad-outline' : 'help-outline'} 
                        size={20} 
                        color="#F06292" 
                      />
                      <Text style={styles.moodBadgeText}>{feedback.mood}</Text>
                    </View>
                    <Text style={styles.feedbackTimestamp}>{feedback.timestamp}</Text>
                  </View>
                  <Text style={styles.feedbackCardText}>{feedback.text}</Text>
                  {feedback.email && <Text style={styles.feedbackEmail}>{feedback.email}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A0E4A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 50,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  moodIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  moodIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F06292',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    marginBottom: 40,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
    marginHorizontal: 20,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#F06292',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F06292',
    position: 'absolute',
    top: -10,
    marginLeft: -12, // Half the width to center it
  },
  moodLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  moodLabel: {
    color: '#AAA',
    fontSize: 16,
  },
  activeMoodLabel: {
    color: '#F06292',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textAreaContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    padding: 15,
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    color: '#AAA',
  },
  emailInputContainer: {
    marginBottom: 30,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    padding: 15,
    height: 50,
  },
  sendButton: {
    backgroundColor: '#4A0E4A',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previousFeedbackContainer: {
    marginTop: 20,
  },
  previousFeedbackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feedbackCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F06292',
  },
  feedbackCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE5EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  moodBadgeText: {
    color: '#F06292',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  feedbackTimestamp: {
    color: '#AAA',
    fontSize: 12,
  },
  feedbackCardText: {
    marginBottom: 10,
    fontSize: 16,
  },
  feedbackEmail: {
    color: '#888',
    fontSize: 14,
  }
});

export default FeedbackScreen;