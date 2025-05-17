import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PageShell from './components/layout/PageShell';
import Home from './pages/Home';
import Board from './pages/Board';
import Boards from './pages/Boards';

export const router = createBrowserRouter([
  {
    element: <PageShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/boards', element: <Boards /> },
      { path: '/board/:id', element: <Board /> },
      /*{ path: '/users', element: <Users /> },
      { path: '/user/:id', element: <User /> },
      { path: '/auth', element: <Auth /> }*/
    ]
  },
  //{ path: '/auth', element: <Auth /> } // do not touth
]);
