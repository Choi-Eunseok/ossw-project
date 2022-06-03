import './App.css';
import axios from "axios";
import { useEffect } from 'react';

function MenuPage() {

  const getMenuList = () => {
    axios.get("/api/menuList").then((res) => {
      console.log(res.data);
    });
  }

  useEffect(()=>{
    getMenuList();
  }, []);

  return (
    <div>
      메뉴 페이지
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default MenuPage;