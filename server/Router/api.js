const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const XMLHttpRequest = require('xhr2');

mongoose.connect('mongodb+srv://choieunseok:uA3mhjPcB3DwsuuD@cluster0.2gsua4u.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Connected to mongodb Server')
});

const dayPostList = mongoose.Schema({
  date: 'string',
  idArray: [{ type: String }]
});
const dayPostListModel = mongoose.model('dayPostList', dayPostList);
const post = mongoose.Schema({
  date: 'string',
  time: 'string',
  title: 'string',
  content: 'string',
  password: 'string'
});
const postModel = mongoose.model('post', post);

const waiting = mongoose.Schema({
  date: 'string',
  waiting: []
});
const waitingModel = mongoose.model('waiting', waiting);

// router.get('/api', (req, res) => {
//   res.send({ test: "hi" });
// });

function getCurrentDate(originDate) {
  var date;
  if (originDate == null) date = new Date();
  else date = new Date(originDate);
  var year = date.getFullYear().toString();

  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month.toString() : month.toString();

  var day = date.getDate();
  day = day < 10 ? '0' + day.toString() : day.toString();

  return year + '-' + month + '-' + day;
}

function getCurrentTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = hour < 10 ? '0' + hour.toString() : hour.toString();

  var minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute.toString() : minute.toString();

  return hour + ":" + minute;
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

router.get('/api/getList', async (req, res) => {                                                                 // 오늘 게시물들의 아이디 표시
  try {
    const today = getCurrentDate();
    var testDayPostList = await dayPostListModel.findOne({ date: today });
    if (testDayPostList == null) testDayPostList = new dayPostListModel({ date: today, idArray: [] });
    res.send(testDayPostList.idArray);
  }
  catch (err) {
    res.send(err.message);
  }
});

router.get('/api/getList/:date', async (req, res) => {                                                           // 특정 날자의 게시물들의 아이디 표시
  try {
    const today = getCurrentDate(req.params.date);
    var testDayPostList = await dayPostListModel.findOne({ date: today });
    if (testDayPostList == null) testDayPostList = new dayPostListModel({ date: today, idArray: [] });
    res.send(testDayPostList.idArray);
  }
  catch (err) {
    res.send(err.message);
  }
});

router.post('/api/get', async (req, res) => {                                                                     // 특정 id(여러개)의 게시물 내용 요약 불러오기
  try {
    const idArray = req.body.idArray;
    var resultArray = [];
    for (const id of idArray) {
      const onePost = await postModel.findById(id);
      var tempJSON = {};
      tempJSON.id = onePost.id;
      tempJSON.time = onePost.time;
      tempJSON.title = onePost.title;
      tempJSON.content = onePost.content;
      tempJSON.content = tempJSON.content.replace(/(?:\r\n|\r|\n| )/g, '');
      const sliceLength = 10;
      if (tempJSON.title.length > sliceLength) tempJSON.title = tempJSON.title.slice(0, sliceLength) + "...";
      if (tempJSON.content.length > sliceLength) tempJSON.content = tempJSON.content.slice(0, sliceLength) + "...";
      resultArray.push(tempJSON);
    }
    res.send(resultArray);
  }
  catch (err) {
    res.send(err.message);
  }
});

router.get('/api/get/:id', async (req, res) => {                                                                 // 특정 id의 게시물 불러오기
  try {
    const currentPost = await postModel.findById(req.params.id);
    res.send({ date: currentPost.date, time: currentPost.time, title: currentPost.title, content: currentPost.content });
  }
  catch (err) {
    res.send(err.message);
  }
});

router.post('/api/isPassEqual', async (req, res) => {                                                            // 암호가 같으면 success, 아니면 failed
  try {
    const currentPost = await postModel.findById(req.body.id);
    if (currentPost.password == req.body.password) res.send("success");
    else res.send("failed");
  }
  catch (err) {
    res.send("failed");
  }
});

router.post('/api/postSave', async (req, res) => {                                                              // 오늘 게시물 작성
  try {
    var isFirst = false;
    const today = getCurrentDate();
    const time = getCurrentTime();

    var testDayPostList = await dayPostListModel.findOne({ date: today });
    if (testDayPostList == null) {
      testDayPostList = new dayPostListModel({ date: today, idArray: [] });
      isFirst = true;
    }
    var postListArr = testDayPostList.idArray;
    var newPost = new postModel({ date: today, time:time, title: req.body.title, content: req.body.content, password: req.body.password });
    var newPostData = await newPost.save();
    postListArr.push(newPostData._id.toString());

    if (isFirst) await testDayPostList.save();
    else await dayPostListModel.updateOne({ date: today }, { idArray: postListArr });

    res.send("success");
  }
  catch (err) {
    res.send(err.message);
  }
});

router.put('/api/edit/:id', async (req, res) => {                                                              // 게시물 수정
  try {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    await postModel.findByIdAndUpdate(id, { title: title, content: content });
    res.send("success");
  }
  catch (err) {
    res.send(err.message);
  }
});

router.delete('/api/delete/:id', async (req, res) => {                                                          // 게시물 삭제
  try {
    const id = req.params.id;
    const list = await dayPostListModel.find();
    for (const dayList of list) {
      var newArray = dayList.idArray.filter((data) => { return data != id; })
      if (!arrayEquals(dayList.idArray, newArray)) {
        await dayPostListModel.findByIdAndUpdate(dayList._id.toString(), { idArray: newArray });
      }
    }
    await postModel.findByIdAndDelete(id);
    res.send("success");
  }
  catch (err) {
    res.send(err.message);
  }
});


router.get('/api/waiting', async (req, res) => {                                                                 // 오늘의 대기시간 목록 가져오기
  try {
    const today = getCurrentDate();
    var waitingList = await waitingModel.findOne({ date: today });
    if (waitingList == null) waitingList = []
    else waitingList = waitingList.waiting;

    const date = new Date();
    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour.toString() : hour.toString();
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute.toString() : minute.toString();
    const time = Number(hour + minute);

    var result = [];
<<<<<<< HEAD
    for(const waiting of waitingList){
      if(time - Number(waiting.time.replace(':','')) <= 100){
=======
    for (const waiting of waitingList) {
      if (time - Number(waiting.time.replace(':', '')) <= 100) {
>>>>>>> 18c016a2decd0bfd1caea0f6375e92c895b444f3
        result.push(waiting)
      }
    }
    res.send(result);
  }
  catch (err) {
    res.send(err.message);
  }
});

router.post('/api/waiting', async (req, res) => {                                                                 // 오늘의 대기시간 목록 추가
  try {
    const today = getCurrentDate();
    var waitingList = await waitingModel.findOne({ date: today });

<<<<<<< HEAD
    const date = new Date();
    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour.toString() : hour.toString();
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute.toString() : minute.toString();
    const time = hour + ":" + minute;
    const newWaiting = {value: req.body.value, time: time};
=======
    const time = getCurrentTime();
    const newWaiting = { value: req.body.value, time: time };
>>>>>>> 18c016a2decd0bfd1caea0f6375e92c895b444f3

    if (waitingList == null) await waitingModel({ date: today, waiting: [newWaiting] }).save();
    else {
      waitingList.waiting.push(newWaiting);
      await waitingModel.findOneAndUpdate({ date: today }, { waiting: waitingList.waiting });
    }

    var waitingListResult = await waitingModel.findOne({ date: today });
    res.send(waitingListResult);
  }
  catch (err) {
    res.send(err.message);
  }
});



<<<<<<< HEAD
function setting(resultJson){
=======
function setting(resultJson) {
>>>>>>> 18c016a2decd0bfd1caea0f6375e92c895b444f3
  var result = {}
  result.fo_date = [resultJson.fo_date1, resultJson.fo_date2, resultJson.fo_date3, resultJson.fo_date4, resultJson.fo_date5];
  result.fo_menu_lun = [resultJson.fo_menu_lun1, resultJson.fo_menu_lun2, resultJson.fo_menu_lun3, resultJson.fo_menu_lun4, resultJson.fo_menu_lun5];
  result.fo_menu_eve = [resultJson.fo_menu_eve1, resultJson.fo_menu_eve2, resultJson.fo_menu_eve3, resultJson.fo_menu_eve4, resultJson.fo_menu_eve5];
  return result;
}

router.get('/api/menuList', async (req, res) => {                                                                 // 제2기숙사 학식 메뉴 일주일치 불러오기
  try {

    let newRequest = new XMLHttpRequest();
    newRequest.onreadystatechange = () => {
      if (newRequest.status == 200 && newRequest.readyState == 4) {
        var dt = new Date();
        if (dt.getDay() == 0 || dt.getDay() == 6) {
          resJSON0 = JSON.parse(newRequest.responseText).root[0].LASTNEXT[0]
          resJSON1 = JSON.parse(newRequest.responseText).root[0].LASTNEXT[1]
          if (resJSON0.go === "next_mon") {
            let nextRequest = new XMLHttpRequest();
            nextRequest.onreadystatechange = () => {
              if (nextRequest.status == 200 && nextRequest.readyState == 4) {
                newResJSON = JSON.parse(nextRequest.responseText).root[0].WEEKLYMENU[0]
                res.send(setting(newResJSON));
              }
            }
            nextRequest.open('POST', 'https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc')
            nextRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            nextRequest.send("locgbn=K1&sch_date=" + resJSON0.mon_date + "&fo_gbn=stu")
          } else if (resJSON1.go === "next_mon") {
            let nextRequest = new XMLHttpRequest();
            nextRequest.onreadystatechange = () => {
              if (nextRequest.status == 200 && nextRequest.readyState == 4) {
                newResJSON = JSON.parse(nextRequest.responseText).root[0].WEEKLYMENU[0]
                res.send(setting(newResJSON));
              }
            }
            nextRequest.open('POST', 'https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc')
            nextRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            nextRequest.send("locgbn=K1&sch_date=" + resJSON1.mon_date + "&fo_gbn=stu")
          }
        }
        else {
          resJSON = JSON.parse(newRequest.responseText).root[0].WEEKLYMENU[0]
          res.send(setting(resJSON));
        }
      }
    }
    newRequest.open('POST', 'https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc')
    newRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    newRequest.send("locgbn=K1&sch_date=&fo_gbn=stu")
  }
  catch (err) {
    res.send(err.message);
  }
});

router.get('/api/todayMenu', async (req, res) => {                                                                 // 제2기숙사 학식 메뉴 하루치 불러오기
  try {
    let newRequest = new XMLHttpRequest();
    newRequest.onreadystatechange = () => {
      if (newRequest.status == 200 && newRequest.readyState == 4) {
        var dt = new Date();
        if (dt.getDay() > 0 && dt.getDay() < 6) {
          resJSON = JSON.parse(newRequest.responseText).root[0].WEEKLYMENU[0];
          const weekMenu = setting(resJSON);
          const todayMenu = [weekMenu.fo_menu_lun[dt.getDay() - 1], weekMenu.fo_menu_eve[dt.getDay() - 1]];
          res.send(todayMenu);
        } else res.send("weekend");

      }
    }
    newRequest.open('POST', 'https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc')
    newRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    newRequest.send("locgbn=K1&sch_date=&fo_gbn=stu")
  }
  catch (err) {
    res.send(err.message);
  }
});

// router.get('/api/testSave', async (req, res) => {
//   var isFirst = false;

//   var testDayPostList = await dayPostListModel.findOne({ date: '2022-05-30' });
//   if (testDayPostList == null) {
//     testDayPostList = new dayPostListModel({ date: '2022-05-30', idArray: [] });
//     isFirst = true;
//   }
//   var postListArr = testDayPostList.idArray;

//   var newPost = new postModel({ date: '2022-05-30', title: '테스트 제목', content: '테스트 내용', password: 'password' });
//   var newPostData = await newPost.save();
//   postListArr.push(newPostData._id.toString());

//   if (isFirst) await testDayPostList.save();
//   else await dayPostListModel.updateOne({ date: '2022-05-30' }, { idArray: postListArr });

//   res.send("test");
// });

module.exports = router;

