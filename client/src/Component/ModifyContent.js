import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import './Writing.css'

function ModifyContent() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  let count = 0;
  const getContent = async() => {
    const contId = window.location.pathname.substring(15);

    axios.get(`/api/get/${contId}`).then((res)=>{
      if(count === 0){
        document.getElementById('title').value = res.data.title;
        document.getElementById('content').value = res.data.content;
        count = 1;
      }
    });
 };

  const postContent = async()=>{
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value; 
    const contId = window.location.pathname.substring(15);
    let postContent = {
      "title": title,
      "content": content,
    };

    console.log(postContent);
    if(postContent.title == '' || postContent.content == ''){
      alert('제목과 내용을 모두 적어주세요');
    } else {
      axios.put(`/api/edit/${contId}`, postContent).then((res)=>{
        window.location.href = '/mealtalk';
      });
    }
  }

  useEffect(()=>{
    getContent();
  }, []);
  
  return (
    <div className='writing'>
      <div><input id='title' type='text' placeholder='제목'/></div>
      <div><textarea id='content'></textarea></div>
      <div id='postContent'><button onClick={postContent}>게시글 수정</button></div>
    </div>
  );
}
export default ModifyContent;