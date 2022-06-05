import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './CommuPage.css'

function InnerContent(props) {

  return (
    <div className='outer' style={{cursor:'pointer'}} value={props.id} onMouseUp={() => { window.location.href = `/showcontent/${props.id}`; }}>
      <div className='inner'>{props.title}</div>
      <div className='inner'>{props.content}</div>
      <div className='inner'>{props.time}</div>
    </div>
  );
}


function CommuPage() {
  const [list, setList] = useState([]);
  const moveToYesterDay = () => {window.location.href = '/mealtalk/yesterday';}
  const moveToWriting = () => {window.location.href = '/writing';}
  
  const todayInnerContent = async () => { // 게시글 목록 가져오기
    const arr = (await axios.get('/api/getList')).data;
    var idArray = [];
    for(var id of arr) idArray.push(id);
    axios.post('/api/get',{idArray:idArray}).then((res)=>{
      const reverseArr = res.data.reverse();
      setList(reverseArr);
      console.log(reverseArr);
    })
  };

  useEffect(() => {
    todayInnerContent();
  }, []);

  return (
    <div className='commuPage'>
        <div>
          {list.map((item, index) => {
            return (
              <InnerContent key={index} id= {item.id} title={item.title} content={item.content} time={item.time} />
            )
          })}
        </div>
        <div>
            <button onClick={moveToWriting}>글 작성</button>
            <button onClick={moveToYesterDay}>어제 보기</button>
        </div>
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default CommuPage;