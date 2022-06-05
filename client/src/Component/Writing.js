import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './Writing.css'

function Writing() {

  const postContent = async()=>{
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value; 

    const password = await prompt('비밀번호를 입력하세요');

    let postContent = {
      "title": title,
      "content": content,
      "password": password,
    };

    console.log(postContent);
    if(postContent.title == '' || postContent.content == ''){
      alert('제목과 내용을 모두 적어주세요');
    } else {
      axios.post('/api/postSave', postContent).then((res)=>{
        window.location.href = '/mealtalk';
      });
    }
  }

  useEffect(()=>{

  }, []);
  
  return (
    <div className='writing'>
      <div><input id='title' type='text' placeholder='제목' /></div>
      <div><textarea id='content'></textarea></div>
      <div id='postContent'><button onClick={postContent}>게시글 등록</button></div>
    </div>
  );
}
export default Writing;