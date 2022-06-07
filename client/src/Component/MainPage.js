import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './MainPage.css'


function InnerContent(props) {

  return (
    <div className='outer' style={{cursor:'pointer'}} value={props.id} onMouseUp={() => { window.location.href = `/showcontent/${props.id}`; }}>
      <div className='inner'>{props.title}</div>
      <div className='inner'>{props.content}</div>
      <div className='inner'>{props.time}</div>
    </div>
  );
}

function MainPage() {
  const [list, setList] = useState([]);
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;
  let currentDate = new Date().getDate();
  let today = currentYear + '/' + currentMonth + '/' + currentDate;

  const todayMealTable = async () => {
    axios.get("/api/todayMenu").then(
      (res) => {
        const makeTable = (arr_, dom_) => {

          arr_.forEach((elem) => {
            let span_ = document.createElement('div');
            span_.innerHTML = elem;
            span_.style.borderWidth = '0px';
            span_.style.textAlign = 'center';
            span_.style.gridTemplateColumns = '100%';
            span_.style.backgroundColor = '#FDF5E6';
            span_.style.padding = '0%';
            dom_.appendChild(span_);
          });

        };
        const lunchDom = document.getElementsByClassName('lunchTable')[0];
        const dinnerDom = document.getElementsByClassName('dinnerTable')[0];

        if (res.data !== "weekend") {
          const index1 = res.data[0].indexOf(':');
          const index2 = res.data[1].indexOf(':');
          let lunchArr = res.data[0].substring(index1 + 1);
          let dinnerArr = res.data[1].substring(index2 + 1);

          if (index1 !== -1) {
            lunchArr = lunchArr.split(',');
          } else {
            lunchArr = [lunchArr];
          }
          if (index2 !== -1) {
            dinnerArr = dinnerArr.split(',');
          } else {
            dinnerArr = [dinnerArr];
          }
          console.log(lunchArr, dinnerArr);

          makeTable(lunchArr, lunchDom);
          makeTable(dinnerArr, dinnerDom);
        }
        else{
          makeTable(["오늘은"], lunchDom);
          makeTable(["주말입니다."], dinnerDom);
        }

      }
    )
  };

  const todayInnerContent = async () => { // 게시글 목록 가져오기
    const arr = (await axios.get('/api/getList')).data;
    var idArray = [];
    for(var id of arr) idArray.push(id);
    axios.post('/api/get',{idArray:idArray}).then((res)=>{
      const reverseArr = res.data.reverse().slice(0,6); // 8개만 띄우기
      setList(reverseArr);
      console.log(reverseArr);
    })
  };


  useEffect(() => {
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
        <div className='lunchTable'></div>
        <div className='dinnerTable'></div>
      </div>
      <div className='mainpageUnder'>
        <div style={{paddingLeft:'1%'}}>메뉴에 대한 이야기</div>
        <div className='contentCover'>
          {list.map((item, index) => {
            return (
              <InnerContent key={index} id= {item.id} title={item.title} content={item.content} time={item.time} />
            )
          })}
        </div>
      </div>
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default MainPage;