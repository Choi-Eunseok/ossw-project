import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TopBanner from './Component/TopBanner';
import SideChat from './Component/SideChat';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='Screen' style={{width: '100vw', height:'100vh', margin:'0%', padding:'0%', }}>
      <TopBanner />
      <SideChat />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
