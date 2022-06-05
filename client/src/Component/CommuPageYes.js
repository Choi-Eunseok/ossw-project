import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './CommuPage.css'

function InnerContent(props) {

  return (
    <div className='outer' value={props.id} onMouseUp={() => { window.location.href = `/showcontent/${props.id}`; }}>
      <div className='inner'>{props.title}</div>
      <div className='inner'>{props.content}</div>
      <div className='inner'>{props.time}</div>
    </div>
  );
}

function CommuPageYes() {
  const [list2, setList2] = useState([]);
  const moveToToday = () => {window.location.href = '/mealtalk';}
  const moveToWriting = () => {window.location.href = '/writing';}
  
  const yesterInnerContent = async () =>{
    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate() -1;  // 날짜
    let todayDate = year+'-0'+month+'-0'+date;  // date에 넣을 문자열

    const arr = (await axios.get(`/api/getList/:${todayDate}`)).data;
    var idArray = [];
    for(var id of arr) idArray.push(id);
    axios.post('/api/get',{idArray:idArray}).then((res)=>{
      const reverseArr = res.data.reverse();
      setList2(reverseArr);
      console.log(reverseArr);
    })
  };

  useEffect(() => {
    yesterInnerContent();
  }, []);

  return (
    <div className='commuPage'>
        <div>
          {list2.map((item, index) => {
            return (
              <InnerContent key={index} id= {item.id} time={item.time} title={item.title} content={item.content} />
            )
          })}
        </div>
        <div>
            <button onClick={moveToWriting}>글 작성</button>
            <button onClick={moveToToday}>오늘 보기</button>
        </div>
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default CommuPageYes;