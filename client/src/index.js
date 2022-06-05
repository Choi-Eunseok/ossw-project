import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

//컴포넌트
import TopBanner from './Component/TopBanner'; // 상단 메뉴
import SideChat from './Component/SideChat'; // 측면 대기시간 채팅
import MainPage from './Component/MainPage'; // 초기화면
import MenuPage from './Component/MenuPage'; // 학식 메뉴 화면
import CommuPage from './Component/CommuPage'; // 학식 커뮤 화면(오늘)
import CommuPageYes from './Component/CommuPageYes'; // 학식 커뮤 화면(어제)
import Writing from './Component/Writing'; // 글 작성 화면

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
          <Route path="/mealtalk" element={<CommuPage />} />
          <Route path="/mealtalk/yesterday" element={<CommuPageYes />} /> 
          <Route path="/writing" element={<Writing />} />
        </Routes>
      </Router>
    </div>


  </div>
  
);

reportWebVitals();
