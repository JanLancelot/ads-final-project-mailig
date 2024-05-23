// // Chat.js
// import React, { useState, useEffect, useRef } from 'react';
// import { db, auth } from '../firebase';
// import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp  } from "firebase/firestore";

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const messagesRef = collection(db, "messages");
//     const q = query(messagesRef, orderBy("createdAt", "asc"));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const fetchedMessages = [];
//       querySnapshot.forEach((doc) => {
//         fetchedMessages.push({ id: doc.id, ...doc.data() });
//       });
//       setMessages(fetchedMessages);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     // Scroll to bottom when messages update
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (message.trim() !== "") {
//       try {
//         await addDoc(collection(db, "messages"), {
//           text: message,
//           sender: auth.currentUser.uid, // Assuming you have user authentication
//           createdAt: serverTimestamp()
//         });
//         setMessage(""); // Clear the input field
//       } catch (error) {
//         console.error("Error adding message: ", error);
//       }
//     }
//   };

//   return (
//     <div className="flex h-screen antialiased text-gray-800">
//       <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
//         <div className="bg-gray-100 flex items-center justify-between py-3 px-5 border-b-2 border-gray-200">
//           <h2 className="text-lg font-medium">Chat with Admin</h2>
//         </div>
//         <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
//           {messages.map((message) => (
//             <div 
//               key={message.id}
//               className={`flex ${
//                 message.sender === auth.currentUser.uid ? 'justify-end' : 'justify-start'
//               } mb-4`}
//             >
//               <div
//                 className={`relative max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${
//                   message.sender === auth.currentUser.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
//                 }`}
//               >
//                 <span>{message.text}</span>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
//         </div>
//         <form onSubmit={handleSubmit} className="bg-gray-100 py-3 px-5 border-t-2 border-gray-200">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Type your message..."
//               className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="absolute right-0 items-center justify-center h-full w-10 text-blue-500"
//             >
//               <svg
//                 className="w-6 h-6 transform rotate-90"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//               </svg>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where } from "firebase/firestore";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [users, setUsers] = useState([]); 
  const messagesEndRef = useRef(null);
  const isAdmin = auth.currentUser.uid === 'YNuDWPPdWyezhPSeRqiS3VPLPfN2';

  useEffect(() => {
    // Fetch all users (except the admin) for the admin to select
    if (isAdmin) {
      const fetchUsers = async () => {
        const usersRef = collection(db, "users"); // Assuming you have a "users" collection
        const q = query(usersRef, where("uid", "!=", auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedUsers = [];
          querySnapshot.forEach((doc) => {
            fetchedUsers.push({ id: doc.id, ...doc.data() });
          });
          setUsers(fetchedUsers);
        });
        return () => unsubscribe();
      };
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Listening for messages based on selected user
    const fetchMessages = async () => {
      const messagesRef = collection(db, "chats");
      let q;

      if (isAdmin && selectedUser) {
        // Query messages between admin and the selected user
        q = query(
          messagesRef, 
          where("sender", "in", [auth.currentUser.uid, selectedUser.uid]),
          orderBy("createdAt", "asc")
        );
      } else {
        // For regular users, just fetch messages between them and the admin
        q = query(
          messagesRef,
          where("sender", "in", [auth.currentUser.uid, 'YNuDWPPdWyezhPSeRqiS3VPLPfN2']), // Admin UID
          orderBy("createdAt", "asc")
        );
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(fetchedMessages);
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
    // Admin View
    return (
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-col w-64 bg-gray-800 text-white">
          {/* User List */}
          <h2 className="text-lg font-medium p-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-2 cursor-pointer hover:bg-gray-700 ${
                  selectedUser?.id === user.id ? 'bg-gray-700' : ''
                }`}
              >
                {user.email} {/* Display user identifier (e.g., email) */}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area (only if a user is selected) */}
        {selectedUser && (
          <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gray-100 flex items-center justify-between py-3 px-5 border-b-2 border-gray-200">
              <h2 className="text-lg font-medium">Chat with {selectedUser.email}</h2> 
            </div>
            <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
              {/* Same message display logic as before */}
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
            <form onSubmit={handleSubmit} className="bg-gray-100 py-3 px-5 border-t-2 border-gray-200">
              {/* Input field and send button */}
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
                  {/* Send button SVG */}
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
    // Regular User View (same as before)
    return ( 
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-100 flex items-center justify-between py-3 px-5 border-b-2 border-gray-200">
          <h2 className="text-lg font-medium">Chat with Admin</h2>
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
          <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
        </div>
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