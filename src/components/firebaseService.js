
// firebaseService.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, serverTimestamp, off, onDisconnect } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC9_p1FA0kxbHpCAyvhukWq2ZqIPDh3Vis",
  authDomain: "lts-admission-form.firebaseapp.com",
  databaseURL: "https://lts-admission-form-default-rtdb.firebaseio.com",
  projectId: "lts-admission-form",
  storageBucket: "lts-admission-form.firebasestorage.app",
  messagingSenderId: "469201694810",
  appId: "1:469201694810:web:c7675449c451b8a7bba863",
  measurementId: "G-SW94NFJB7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Chat service functions
export const createChatSession = async (sessionId) => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await set(sessionRef, {
    createdAt: serverTimestamp(),
    status: {
      userOnline: true,
      agentOnline: false,
      agentTyping: false
    },
    messages: []
  });
  
  // Set up disconnect handler
  const userStatusRef = ref(database, `sessions/${sessionId}/status/userOnline`);
  onDisconnect(userStatusRef).set(false);
  
  return sessionId;
};

export const sendMessage = async (sessionId, messageText, sender, senderName = null) => {
  if (!sessionId) {
    console.error('No session ID available');
    throw new Error('Session not initialized');
  }

  const messageData = {
    text: messageText,
    sender: sender,
    senderName: senderName || (sender === 'user' ? 'User' : 'Support Agent'),
    timestamp: new Date().toISOString(),
    read: sender === 'agent' // Agent messages are marked as read by default
  };

  const messagesRef = ref(database, `sessions/${sessionId}/messages`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, messageData);
  
  return messageData;
};

export const listenToSessions = (callback) => {
  const sessionsRef = ref(database, 'sessions');
  const unsubscribe = onValue(sessionsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
  
  return unsubscribe;
};

export const listenToSessionMessages = (sessionId, callback) => {
  const messagesRef = ref(database, `sessions/${sessionId}/messages`);
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messageList = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      callback(messageList);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

export const listenToSessionStatus = (sessionId, callback) => {
  const statusRef = ref(database, `sessions/${sessionId}/status`);
  const unsubscribe = onValue(statusRef, (snapshot) => {
    const status = snapshot.val();
    callback(status || {
      userOnline: false,
      agentOnline: false,
      agentTyping: false
    });
  });
  
  return unsubscribe;
};

export const updateSessionStatus = async (sessionId, statusUpdates) => {
  const statusRef = ref(database, `sessions/${sessionId}/status`);
  await set(statusRef, {
    ...statusUpdates,
    lastUpdated: serverTimestamp()
  });
};

export const markMessagesAsRead = async (sessionId, messageIds) => {
  if (!messageIds || messageIds.length === 0) return;
  
  for (const messageId of messageIds) {
    const messageRef = ref(database, `sessions/${sessionId}/messages/${messageId}/read`);
    await set(messageRef, true);
  }
};

export default database;