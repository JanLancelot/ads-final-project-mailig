import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  onSnapshot,
} from "firebase/firestore";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDirection, setOrderDirection] = useState("desc"); // Initial order direction (descending)
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("timestamp", "desc") // Fetch in descending order
        );
        const querySnapshot = await getDocs(messagesQuery);
        const messagesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesArray);
        setTotalMessages(messagesArray.length);
        setUnreadCount(messagesArray.filter((message) => !message.read).length);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const toggleRead = (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    updateDoc(messageRef, { read: true });

    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, read: true } : message
      )
    );
  };

  const filterMessages = () => {
    if (searchQuery === "") {
      return messages;
    }
    const filteredMessages = messages.filter(
      (message) =>
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredMessages;
  };

  const toggleUnread = (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    updateDoc(messageRef, { read: false });

    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, read: false } : message
      )
    );
  };

  const handleSortChange = () => {
    setOrderDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );

    // Sort the messages array in-place
    setMessages((prevMessages) => {
      return prevMessages.sort((a, b) => {
        if (orderDirection === "asc") {
          return a.timestamp - b.timestamp;
        } else {
          return b.timestamp - a.timestamp;
        }
      });
    });
  };

  return (
    <div className="flex h-screen">
      <button
        className="flex md:hidden items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-900 hover:border-gray-300"
        onClick={toggleSidebar}
      >
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } bg-gray-800 text-gray-100 w-64 p-4 md:block`}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav>
          <a
            href="#"
            className={`block py-2 px-4 rounded ${
              activeTab === "messages" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </a>
          <a
            href="#"
            className={`block py-2 px-4 rounded ${
              activeTab === "content" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("content")}
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
            {activeTab === "messages" && (
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
                    onClick={handleSortChange}
                  >
                    Sort {orderDirection === "asc" ? "▲" : "▼"}
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
                          !message.read ? "border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <h3 className="text-lg font-bold">{message.name}</h3>
                        <p className="text-gray-600">{message.email}</p>
                        <p className="mt-2">{message.message}</p>
                        <p className="text-gray-500">
                          {/* Format the timestamp */}
                          {new Date(
                            message.timestamp.seconds * 1000
                          ).toLocaleString()}
                        </p>
                        <button
                          className={`mt-2 px-4 py-2 rounded ${
                            !message.read
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-700"
                          }`}
                          onClick={() => toggleRead(message.id)}
                        >
                          {!message.read ? "Mark as Read" : "Mark as Unread"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No messages found.</p>
                )}
              </div>
            )}
            {activeTab === "content" && (
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
