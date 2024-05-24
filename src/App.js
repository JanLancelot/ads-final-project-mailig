// App.js
import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import About from './pages/About';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: '/signin',
    element: <SignInPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/projects',
    element: <Projects />
  },
  {
    path: '/about',
    element: <About />
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;