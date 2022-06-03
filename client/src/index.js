import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TopBanner from './Component/TopBanner';
import SideChat from './Component/SideChat';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './Component/mainpage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='Screen' style={{borderColor:'blue', width:'100vw', height:'100vh'}}>
      <TopBanner />
      
      <SideChat />
      <div className='bodyContent' style={{width:'100%', height:'80%'}}>
        <MainPage />
      </div>
      
     
    </div>
  </React.StrictMode>
);

{/* <div className='scrollmake' style={{height:'1200px', width:'100px',backgroundColor:'red' }}>
바보
</div> */}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
