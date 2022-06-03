import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TopBanner from './Component/TopBanner';
import SideChat from './Component/SideChat';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './Component/mainpage';
import MenuPage from './Component/MenuPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className='Screen' style={{ borderColor: 'blue', width: '100vw', height: '100vh' }}>
    <TopBanner />

    <SideChat />
    <div className='bodyContent' style={{ width: '100%', height: '100%' }}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </Router>
    </div>


  </div>
  
);

reportWebVitals();
