import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './MainPage.css'

function InnerContent(props){
  return (
    <div>
      <div style={{fontSize:'15px', height: '10px', width:'100%', backgroundColor:'#FDF5E6'}}>{props.title} {props.content}</div>
    </div>
  );
}


function MainPage() {
  const [list, setList] = useState([{title: '하이', content: '바보'},{title: '하이2', content: '바보2'},{title: '하이3', content: '바보3'}]);
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let currentDate = new Date().getDate();
  let today = currentYear+'/'+currentMonth+'/'+currentDate;
  
  
  const todayMealTable = async()=>{
    axios.get("/api/todayMenu").then(
      (res) => {
        const makeTable = (arr_, dom_) => {
    
          arr_.forEach((elem)=>{
            let span_ = document.createElement('div');
            span_.innerHTML = elem;
            dom_.appendChild(span_);
          });
        
      };

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

        const lunchDom = document.getElementsByClassName('lunchTable')[0];
        const dinnerDom = document.getElementsByClassName('dinnerTable')[0];
        
        makeTable(lunchArr, lunchDom);
        makeTable(dinnerArr, dinnerDom);         
      }
    )
  };

  const todayInnerContent = async()=>{ // 게시글 목록 가져오기
    axios.get('/api/get').then((res) => {
      console.log(res.data);
      }
    );
  }

  useEffect(()=>{
    todayMealTable();
    todayInnerContent();
  }, []);
  
  return (
    <div className='mainpage'>
      
      <div>
        <div className='haksikTitle'>
          {today} 제2기숙사 학식
        </div>
        <div></div>
        <div>점심</div>
        <div>저녁</div>
        <div className='lunchTable'>
          
        </div>
        <div className='dinnerTable'></div>
      </div>
      <div className='mainpageUnder'>
        <div>메뉴에 대한 이야기</div>
        <div>
          {list.map((item,index)=>{
            return(
              <InnerContent key={index} title={item.title} content={item.content}/>
            )
          })}
        </div>
      </div>
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default MainPage;