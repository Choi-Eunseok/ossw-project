import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './ShowContent.css'

function ShowContent() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [item, setItem] = useState('');

   const getContent = async() => {
      const contId = window.location.pathname.substring(13);
      console.log(contId);
      axios.get(`/api/get/${contId}`).then((res)=>{
        setTitle(res.data.title);
        setContent(res.data.content);
        setItem(res.data.date+' '+res.data.time);

        console.log(title, content, item);
      });
   };

  useEffect(()=>{
    getContent();
  }, []);
  
  return (
    <div className='contentOuter'>
      <div className='content'>{title}</div>
      <div className='content'>{content}</div>
      <div className='content'>{item}</div>
    </div>
  );
}
export default ShowContent;