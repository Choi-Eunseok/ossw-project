import './App.css';
import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import './SideChat.css'
import InnerChat from './InnerChat';

function SideChat() {
  const chatContainer = useRef(null);
  const [list, setList] = useState([]);

  const getWaiting = () => {
    axios.get("/api/waiting").then((res) => {
      var newList = [];
      setList(res.data);
      setTimeout(() =>{
        const scroll = chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
        chatContainer.current.scrollTo(0, scroll);
      },100);
    });
  }

  const postWaiting = (inp) => {
    axios.post("/api/waiting", {value:inp}).then((res) => {
      getWaiting();
    });
  }

  useEffect(() => {
    getWaiting();
    scrollChat();
  }, []);

  return (
    <div className='SideChat'>
      <div ref={chatContainer} className='innerChat1'>
        {list.map((item, index) => {
          return (
              <InnerChat key={index} value={item.value} time={item.time}/>
          )
        })}
      </div>
      <div className='innerChat2'>
        <div>
          대기시간
        </div>
        <div className='innerBtnCover'>
          <button className='innerBtn' id='under5' onClick={()=>postWaiting("5분 이내")}>5분 이내</button>
          <button className='innerBtn' id='5to10' onClick={()=>postWaiting("5분~10분")}>5분~10분</button>
          <button className='innerBtn' id='over10' onClick={()=>postWaiting("10분 이상")}>10분 이상</button>
        </div>
      </div>
    </div>

  );
}

const scrollChat = () => {
  let scrollY;

  const sideChat = document.getElementsByClassName('SideChat')[0];

  scrollY = window.scrollY + document.body.scrollHeight / 5 - 50;
  sideChat.style.top = scrollY + "px";

  const reposition = () => { // 화면 크기 바뀔때도 이래야함--> 추후수정
    sideChat.style.transition = '500ms';
    scrollY = window.scrollY + document.body.scrollHeight / 5 - 50;
    sideChat.style.top = scrollY + "px";
  }

  document.addEventListener('scroll', reposition);
  document.addEventListener('resize', reposition);


}

// 각 버튼마다 서버에 알맞은 요청 전송
// 받아온 응답을 배열에 넣기 --> 채팅창은 한정되어있으므로 배열 크기는 한정
// 응답은 {id, 대기시간, 현재시간}을 모아놓은 배열로
// innerChat1은 아래쪽 정렬

export default SideChat;