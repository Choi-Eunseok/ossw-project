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
      axios.get(`/api/get/${contId}`).then((res)=>{
        setTitle(res.data.title);
        setContent(res.data.content);
        setItem(res.data.date+' '+res.data.time);

        console.log(title, content, item);
      });
   };

    const modify = async()=>{
     const contId = window.location.pathname.substring(13);
     const getPassword = await prompt('비밀번호를 입력해주세요');
     const call = { 'id': contId, 'password': getPassword}; 
     console.log(call);
     if(getPassword != null){
      axios.post(`/api/isPassEqual`, call).then((res)=>{
        console.log(res);
        if(res.data == 'success'){
          window.location.href = `/modifycontent/${contId}`;
        } else if (res.data == 'failed'){
          alert('비밀번호가 틀렸습니다.');
        }
      });
     }     
     };
    
    const delete_ = async()=>{
      const contId = window.location.pathname.substring(13);
      const getPassword = await prompt('비밀번호를 입력해주세요');
      const call = { 'id': contId, 'password': getPassword}; 
      if(getPassword != null){
        axios.post(`/api/isPassEqual`, call).then((res)=>{
          console.log(res, '삭제');
          if(res.data == 'success'){
            axios.delete(`/api/delete/${contId}`).then((res)=>{
              window.location.href = `/mealtalk`;
            });
          } else if (res.data == 'failed'){
            alert('비밀번호가 틀렸습니다.');
          }
        });
       }
    }

  useEffect(()=>{
    getContent();
  }, []);
  
  return (
    <div className='contentOuter'>
      <div className='content'>{title}</div>
      <div className='content'>{content}</div>
      <div className='content'><p>{item}</p><button onMouseUp={modify}>수정</button><button onMouseUp={delete_}>삭제</button></div>
    </div>
  );
};

export default ShowContent;