import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import './SideChat.css'

const scrollChat = () => {
  let scrollY;

  const sideChat = document.getElementsByClassName('SideChat')[0];

  scrollY = window.scrollY + window.outerHeight / 2;
  sideChat.style.top = scrollY +"px";

  document.addEventListener('scroll', ()=>{
    sideChat.style.transition = '800ms';
    scrollY = window.scrollY + window.outerHeight / 2;
    sideChat.style.top = scrollY +"px";

  });


}

function SideChat() {
  const callApi = async()=>{
    axios.get("/api").then((res)=>{console.log(res.data.test)});
  };

  useEffect(()=>{
    callApi();
    scrollChat();
  }, []);
  
  return (
    <div>
      <div className='SideChat' height="100px" width="100px" style={{background:"gray"}}>
        하이
        
      </div>


      <div className='scrollmake'>
      바보
      </div>
    </div>
  );
}

export default SideChat;