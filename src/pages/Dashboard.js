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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const handleSortChange = () => {
    setOrderDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-gray-100 w-64 p-4 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-16" : ""
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-gray-200"
          >
            {sidebarCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3.707-3.707a1 1 0 00-1.414 1.414l3.707 3.707a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 1.414L10 10.586l4.293-4.293a1 1 0 111.414 1.414L11.414 11.414l4.293 4.293a1 1 0 01-1.414 1.414L10 12.586l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 11.414 4.293 7.121a1 1 0 011.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
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
                          {new Date(message.timestamp.seconds * 1000).toLocaleString()}
                        </p>
                        <button
                          className={`mt-2 px-4 py-2 rounded ${
                            !message.read
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-700"
                          }`}
                          onClick={() => toggleRead(message.id)}
                        >
                          {!message.read ? "Mark as Read" : "Read"}
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