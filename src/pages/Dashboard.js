import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { InboxIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
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

const navigation = [
  {
    name: "Messages",
    icon: InboxIcon,
    current: false,
    children: [
      { name: "All Messages", href: "#messages" },
      { name: "Archived", href: "#archived" },
    ],
  },
  {
    name: "Content",
    href: "#content",
    icon: DocumentDuplicateIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("messages"); // Start with 'messages'
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const filterMessages = (archivedFilter = false) => {
    return messages.filter(
      (message) =>
        message.archived === archivedFilter &&
        (searchQuery === "" ||
          message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.message.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleSortChange = () => {
    setOrderDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );

    setMessages((prevMessages) => {
      return [...prevMessages].sort((a, b) => {
        // Create new array to avoid mutating state directly
        if (orderDirection === "asc") {
          return a.timestamp.toDate() - b.timestamp.toDate();
        } else {
          return b.timestamp.toDate() - a.timestamp.toDate();
        }
      });
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex grow-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 w-72">
        <div className="flex h-16 shrink-0 items-center">
          {/* Replace with your logo */}
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <a
                        href={item.href}
                        onClick={() => setActiveTab(item.name.toLowerCase())}
                        className={classNames(
                          item.name.toLowerCase() === activeTab
                            ? "bg-gray-50"
                            : "hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700"
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                open ? "bg-gray-50" : "hover:bg-gray-50",
                                "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700"
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              {item.name}
                              <ChevronRightIcon
                                className={classNames(
                                  open
                                    ? "rotate-90 text-gray-500"
                                    : "text-gray-400",
                                  "ml-auto h-5 w-5 shrink-0"
                                )}
                                aria-hidden="true"
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <Disclosure.Button
                                    as="a"
                                    href={subItem.href}
                                    onClick={() =>
                                      setActiveTab(
                                        subItem.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "")
                                      )
                                    }
                                    className={classNames(
                                      subItem.name
                                        .toLowerCase()
                                        .replace(/\s+/g, "") === activeTab
                                        ? "bg-gray-50"
                                        : "hover:bg-gray-50",
                                      "block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
                                    )}
                                  >
                                    {subItem.name}
                                  </Disclosure.Button>
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
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
                <h3 className="text-lg font-semibold mb-2">Unread Messages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {filterMessages(false)
                    .filter((message) => !message.read)
                    .map((message) => (
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
                <h3 className="text-lg font-semibold mb-2">Read Messages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filterMessages(false)
                    .filter((message) => message.read)
                    .map((message) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
