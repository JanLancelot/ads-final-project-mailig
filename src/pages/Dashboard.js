import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, updateDoc, getDocs, query, orderBy, startAfter, limit, onSnapshot } from 'firebase/firestore';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [lastVisible, setLastVisible] = useState(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshMessages, setRefreshMessages] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, 'messages'),
          orderBy('timestamp', sortOrder),
          startAfter(lastVisible || null),
          limit(10)
        );

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
          const messagesArray = [];
          let unreadCount = 0;
          querySnapshot.forEach((doc) => {
            const message = { id: doc.id, ...doc.data() };
            messagesArray.push(message);
            if (!message.read) {
              unreadCount++;
            }
          });
          setMessages((prevMessages) => [...prevMessages, ...messagesArray]);
          setUnreadCount(unreadCount);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setTotalMessages(querySnapshot.size);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching messages: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
    setRefreshMessages(false);
  }, [sortOrder, refreshMessages]);

  const filterMessages = () => {
    const filteredMessages = messages.filter(
      (message) =>
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredMessages;
  };

  const toggleRead = async (messageId) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { read: true });
      setRefreshMessages(true); // Set the state variable to trigger a re-render
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-gray-100 w-64 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav>
          <a
            href="#"
            className={`block py-2 px-4 rounded ${
              activeTab === 'messages' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </a>
          <a
            href="#"
            className={`block py-2 px-4 rounded ${
              activeTab === 'content' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </a>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : (
          <>
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    Sort {sortOrder === 'asc' ? '▲' : '▼'}
                  </button>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600">
                    Total Messages: {totalMessages} | Unread: {unreadCount}
                  </p>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => setMessages([])}
                  >
                    Mark All as Read
                  </button>
                </div>
                {filterMessages().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filterMessages().map((message) => (
                      <div
                        key={message.id}
                        className={`bg-white shadow-md rounded-md p-4 ${
                          !message.read ? 'border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <h3 className="text-lg font-bold">{message.name}</h3>
                        <p className="text-gray-600">{message.email}</p>
                        <p className="mt-2">{message.message}</p>
                        <button
                          className={`mt-2 px-4 py-2 rounded ${
                            !message.read ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                          }`}
                          onClick={() => toggleRead(message.id)}
                        >
                          {!message.read ? 'Mark as Read' : 'Mark as Unread'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No messages found.</p>
                )}
              </div>
            )}
            {activeTab === 'content' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Content</h2>
                {/* Add your content tab logic here */}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;