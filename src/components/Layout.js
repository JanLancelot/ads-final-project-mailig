import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 py-4 text-center text-white">
        &copy; {new Date().getFullYear()} Jan Lancelot Mailig. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;