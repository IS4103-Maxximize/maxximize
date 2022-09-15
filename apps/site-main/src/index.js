import * as ReactDOM from 'react-dom/client';
// import { AuthProvider } from './context/AuthProvider'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  
);
