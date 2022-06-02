const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

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
  title: 'string',
  content: 'string',
  password: 'string'
});
const postModel = mongoose.model('post', post);

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

router.get('/api/get', async (req, res) => {                                                                     // 특정 id(여러개)의 게시물 내용 요약 불러오기
  try {
    const idArray = req.body.idArray;
    var resultArray = [];
    for (const id of idArray) {
      const onePost = await postModel.findById(id);
      var tempJSON = {};
      tempJSON.id = onePost.id;
      tempJSON.title = onePost.title;
      tempJSON.content = onePost.content;
      tempJSON.content = tempJSON.content.replace(/(?:\r\n|\r|\n)/g, '');
      const sliceLength = 10;
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
    res.send({ title: currentPost.title, content: currentPost.content });
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

    var testDayPostList = await dayPostListModel.findOne({ date: today });
    if (testDayPostList == null) {
      testDayPostList = new dayPostListModel({ date: today, idArray: [] });
      isFirst = true;
    }
    var postListArr = testDayPostList.idArray;
    var newPost = new postModel({ date: today, title: req.body.title, content: req.body.content, password: req.body.password });
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
      var newArray = dayList.idArray.filter((data)=>{return data != id;})
      if(!arrayEquals(dayList.idArray, newArray)){
        await dayPostListModel.findByIdAndUpdate(dayList._id.toString(), {idArray: newArray});
      }
    }
    await postModel.findByIdAndDelete(id);
    res.send("success");
  }
  catch (err) {
    res.send(err.message);
  }
});

// 대기시간 관련 디비 수정 부분 추가 ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// 학식 일주일치 불러오는 부분 추가 -----------------------------------------------------------------------------------------------------------------------------------------------------------------

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

