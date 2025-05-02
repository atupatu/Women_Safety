import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const ChatbotScreen = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const url = 'https://normal-joint-hamster.ngrok-free.app';
  const router = useRouter();
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    // Add user message to the messages array
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const userText = message;
    setMessage(''); // Clear input field
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch(`${url}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add bot's response to messages
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request.",
        sender: 'bot',
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.botMessageText
      ]}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.safeArea} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.logo}>
          <Icon name="favorite" size={30} color="#FF4F93" />
          <Text style={styles.logoText}>I'M SAFE</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Icon name="menu" size={30} color="black" style={styles.menuIcon} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Safety Assistant</Text>
        <Text style={styles.subtitle}>
          Ask me anything about your safety or get guidance in difficult situations.
        </Text>
        
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          ListFooterComponent={() => isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        />
      </View>
      
      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={message.trim() === ''}
        >
          <Icon 
            name="send" 
            size={24} 
            color={message.trim() === '' ? '#aaa' : 'white'} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#FF4F93',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
    marginVertical: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: props => (props.sender === 'user' ? 'white' : 'black'),
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    padding: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  typingIndicator: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 3,
    opacity: 0.5,
  },
});

export default ChatbotScreen;