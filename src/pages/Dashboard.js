import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
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
          orderBy("timestamp", "desc")
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

  const toggleRead = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, { read: true });

    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, read: true } : message
      )
    );
    setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
  };

  const markAllAsRead = async () => {
    const unreadMessages = messages.filter((message) => !message.read);
    const batch = db.batch();

    unreadMessages.forEach((message) => {
      const messageRef = doc(db, "messages", message.id);
      batch.update(messageRef, { read: true });
    });

    await batch.commit();

    setMessages((prevMessages) =>
      prevMessages.map((message) => ({ ...message, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);

    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId)
    );
    setTotalMessages((prevTotal) => prevTotal - 1);
    setUnreadCount((prevUnreadCount) =>
      messages.find((message) => message.id === messageId && !message.read)
        ? prevUnreadCount - 1
        : prevUnreadCount
    );
  };

  const archiveMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, { archived: true });

    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, archived: true } : message
      )
    );
  };

  const filterMessages = () => {
    const filteredMessages = messages.filter(
      (message) =>
        (!message.archived || message.archived === false) &&
        (searchQuery === "" ||
          message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.message.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const allMessages = filteredMessages;
    const readMessages = filteredMessages.filter((message) => message.read);
    const unreadMessages = filteredMessages.filter((message) => !message.read);

    console.log("All Messages:", allMessages);
    console.log("Read Messages:", readMessages);
    console.log("Unread Messages:", unreadMessages);

    return filteredMessages;
  };

  const handleSortChange = () => {
    setOrderDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );

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
      <div className="flex flex-col md:flex-row h-full">
        <div
          className={`bg-gray-800 text-gray-100 w-64 p-4 md:block ${
            showSidebar ? "block" : "hidden"
          } sticky top-0`}
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
                activeTab === "archived" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("archived")}
            >
              Archived
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
        <div className="flex-1 p-4 overflow-y-auto">
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
                      onClick={markAllAsRead}
                    >
                      Mark All as Read
                    </button>
                  </div>
                  {filterMessages(false).length > 0 ? (
                    <>
                      <h3 className="text-lg font-semibold mb-2">
                        Unread Messages
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {filterMessages(false)
                          .filter((message) => !message.read)
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`bg-white shadow-md rounded-md p-4 ${
                                !message.read
                                  ? "border-l-4 border-blue-500"
                                  : ""
                              }`}
                            >
                              <h3 className="text-lg font-bold">
                                {message.name}
                              </h3>
                              <p className="text-gray-600">{message.email}</p>
                              <p className="mt-2">{message.message}</p>
                              <p className="text-gray-500">
                                {new Date(
                                  message.timestamp.seconds * 1000
                                ).toLocaleString()}
                              </p>
                              <div className="mt-2 flex space-x-2">
                                <button
                                  className="px-4 py-2 rounded bg-blue-500 text-white"
                                  onClick={() => toggleRead(message.id)}
                                >
                                  Mark as Read
                                </button>
                                <button
                                  className="px-4 py-2 rounded bg-red-500 text-white"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="px-4 py-2 rounded bg-yellow-500 text-white"
                                  onClick={() => archiveMessage(message.id)}
                                >
                                  Archive
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Read Messages
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filterMessages(false)
                          .filter((message) => message.read)
                          .map((message) => (
                            <div
                              key={message.id}
                              className="bg-white shadow-md rounded-md p-4"
                            >
                              <h3 className="text-lg font-bold">
                                {message.name}
                              </h3>
                              <p className="text-gray-600">{message.email}</p>
                              <p className="mt-2">{message.message}</p>
                              <p className="text-gray-500">
                                {new Date(
                                  message.timestamp.seconds * 1000
                                ).toLocaleString()}
                              </p>
                              <div className="mt-2 flex space-x-2">
                                <span className="px-2 py-1 text-xs rounded bg-green-200 text-green-800">
                                  Read
                                </span>
                                <button
                                  className="px-4 py-2 rounded bg-red-500 text-white"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="px-4 py-2 rounded bg-yellow-500 text-white"
                                  onClick={() => archiveMessage(message.id)}
                                >
                                  Archive
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <p>No messages found.</p>
                  )}
                </div>
              )}
              {activeTab === "archived" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Archived Messages</h2>
                  {filterMessages(true).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filterMessages(true).map((message) => (
                        <div
                          key={message.id}
                          className="bg-white shadow-md rounded-md p-4"
                        >
                          <h3 className="text-lg font-bold">{message.name}</h3>
                          <p className="text-gray-600">{message.email}</p>
                          <p className="mt-2">{message.message}</p>
                          <p className="text-gray-500">
                            {new Date(
                              message.timestamp.seconds * 1000
                            ).toLocaleString()}
                          </p>
                          <div className="mt-2 flex space-x-2">
                            <button
                              className="px-4 py-2 rounded bg-red-500 text-white"
                              onClick={() => deleteMessage(message.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No archived messages found.</p>
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
    </div>
  );
};

export default Dashboard;
