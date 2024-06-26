// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  where 
} from "firebase/firestore";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const isAdmin = auth.currentUser.uid === 'YNuDWPPdWyezhPSeRqiS3VPLPfN2'; 

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "!=", auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe(); 
      };
      fetchUsers();
    }
  }, [isAdmin]); 

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesRef = collection(db, "chats");
      let q;

      if (isAdmin && selectedUser) {
        q = query(
          messagesRef,
          where("sender", "in", [auth.currentUser.uid, selectedUser.uid]),
          orderBy("createdAt", "asc")
        );
      } else {
        q = query(
          messagesRef,
          where("sender", "in", [auth.currentUser.uid, 'YNuDWPPdWyezhPSeRqiS3VPLPfN2']),
          orderBy("createdAt", "asc")
        );
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe(); 
    };
    fetchMessages();
  }, [selectedUser, isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      try {
        await addDoc(collection(db, "chats"), {
          text: message,
          sender: auth.currentUser.uid,
          createdAt: serverTimestamp()
        });
        setMessage("");
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  if (isAdmin) {
    return (
      <div className="flex h-screen antialiased text-gray-800">
        {/* User List (Admin View) */}
        <div className="w-64 bg-gray-800 text-white">
          <h2 className="text-lg font-medium p-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className={`p-2 cursor-pointer hover:bg-gray-700 
                          ${selectedUser?.id === user.id ? 'bg-gray-700' : ''}`}
              >
                {user.email} 
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area (Admin View) */}
        {selectedUser && (
          <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gray-100 flex items-center justify-between py-3 px-5 border-b-2 border-gray-200">
              <h2 className="text-lg font-medium">Chat with {selectedUser.email}</h2>
            </div>
            <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.sender === auth.currentUser.uid ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`relative max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${
                      message.sender === auth.currentUser.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <span>{message.text}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Area (Admin View) */}
            <form onSubmit={handleSubmit} className="bg-gray-100 py-3 px-5 border-t-2 border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 items-center justify-center h-full w-10 text-blue-500"
                >
                  <svg
                    className="w-6 h-6 transform rotate-90"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  } else {
    // Regular User View 
    return (
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gray-100 flex items-center justify-between py-3 px-5 border-b-2 border-gray-200">
            <h2 className="text-lg font-medium">Chat with Admin</h2>
          </div>
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            {/* Message Display (Same as Admin View) */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === auth.currentUser.uid ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`relative max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${
                    message.sender === auth.currentUser.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> 
          </div>
    
          {/* Input Area (Same as Admin View) */}
          <form onSubmit={handleSubmit} className="bg-gray-100 py-3 px-5 border-t-2 border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 items-center justify-center h-full w-10 text-blue-500"
              >
                <svg
                  className="w-6 h-6 transform rotate-90"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Chat;