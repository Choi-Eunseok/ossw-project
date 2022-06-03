import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './mainpage.css'




function MainPage() {
  const [lunch, setlunch] = useState("");
  const [dinner, setdinner] = useState("");
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let currentDate = new Date().getDate();
  let today = currentYear+'/'+currentMonth+'/'+currentDate;

  const makeTable = (arr_, dom_) => {

    arr_.forEach((elem)=>{
      let span_ = document.createElement('div');
      span_.innerHTML = elem;
      dom_.appendChild(span_);
      console.log("하이1");
    });

  };

  const todayMealTable = async()=>{
    axios.get("/api/todayMenu").then(
      (res) => {
        const index1 = res.data[0].indexOf(':');
        const index2 = res.data[1].indexOf(':');
        let lunchArr = res.data[0].substring(index1+1);
        let dinnerArr = res.data[1].substring(index2+1);

        if(index1 !== -1){
         lunchArr = lunchArr.split(',');
        }
        if(index1 !== -1){
         dinnerArr = dinnerArr.split(',');
        }
        console.log(lunchArr, dinnerArr);

        const lunchDom = document.getElementsByClassName('lunchTable')[0];
        const dinnerDom = document.getElementsByClassName('dinnerTable')[0];
        
        makeTable(lunchArr, lunchDom);
        makeTable(dinnerArr, dinnerDom);
        setlunch(lunchArr);
        setdinner(dinnerArr);
         
      }
    )
  }


  useEffect(()=>{
    todayMealTable();


  }, []);
  
  return (
    <div className='mainpage'>
      
      <div>
        <div>
          {today} 제2기숙사 학식
        </div>
        <div></div>
        <div>점심</div>
        <div>저녁</div>
        <div className='lunchTable'>
          
        </div>
        <div className='dinnerTable'></div>
      </div>
      <div>

      </div>
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default MainPage;