import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import './mainpage.css'

let today = '~'+'월'+'*'+'일'; // 날짜 받아오기


function MainPage() {
  const callApi = async()=>{
    axios.get("/api").then((res)=>{console.log(res.data.test)});
    
  };

  useEffect(()=>{
    callApi();
  }, []);
  
  return (
    <div className='mainpage' >
      <div className='mainpageInner' id='MealTable' >
        {today} 제2기숙사 학식
        <div>
          
        </div>
      </div>
      <div className='mainpageInner' >
        <div className='whatAboutMeal'>
          오늘 메뉴 어때?
          <div>

          </div>
        </div>
        <div className='whatAboutMeal'>
          어제 메뉴 어땠어?
          <div>
            
          </div>
        </div>
      </div>
    </div>

  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default MainPage;