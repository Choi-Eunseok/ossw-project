import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import './MenuPage.css'

const makeTable = (arr_, dom_) => {
  arr_.forEach((elem)=>{
    let span_ = document.createElement('div');
    span_.innerHTML = elem;
    span_.style.margin = '1%';
    dom_.appendChild(span_);
  });
};

function MenuPage() {
  const getMenuList = () => {
    axios.get("/api/menuList").then((res) => {
      console.log(res.data);
      
      let dateArr = res.data.fo_date;
      let lunchArr = res.data.fo_menu_lun;
      let dinnerArr = res.data.fo_menu_eve;

      console.log(dateArr, lunchArr, dinnerArr);
      
      const menuTable = document.getElementsByClassName('menuTable')[0];
      for(let i=0; i< dateArr.length; i++){
        console.log('하이', dateArr[i], lunchArr[i], dinnerArr[i]);

        const menuTableElem = document.createElement('div');
        menuTableElem.style.width = '19.7%';

        //날짜
        const menuTableElemDate = document.createElement('div');
        menuTableElemDate.innerHTML = dateArr[i];
        menuTableElemDate.style.height = '8%';
        menuTableElemDate.style.paddingLeft = '0.5%';
        menuTableElemDate.style.paddingTop = '4%';
        menuTableElemDate.style.borderBottom = '1px solid black';

        const makeMealTable = (dom_, mealArr)=>{
          let arr_ = mealArr[i].substring(mealArr[i].indexOf(':')+1);
          arr_ = arr_.split(',');
          dom_.style.height = '42%';
          dom_.style.paddingTop = '2%';
          makeTable(arr_, dom_);
        }
        //점심
        const menuTableElemLun = document.createElement('div');
        makeMealTable(menuTableElemLun, lunchArr);
        //저녁
        const menuTableElemDin = document.createElement('div');
        makeMealTable(menuTableElemDin, dinnerArr);


        menuTable.appendChild(menuTableElem);
        menuTableElem.appendChild(menuTableElemDate);
        menuTableElem.appendChild(menuTableElemLun);
        menuTableElem.appendChild(menuTableElemDin);
      }

    });
  }

  useEffect(()=>{
    getMenuList();
    
  }, []);

  return (
    <div className='menuPage'>
      <span>제2기숙사 학식</span>
      <div className='menuTable'>

      </div>
    </div>
  );
}
//첫번째: 오늘 메뉴/ 두번째: 오늘 메뉴에 대한 이야기/ 세번째: 어제 메뉴에 대한 이야기 

export default MenuPage;