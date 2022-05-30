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
  if(originDate == null) date = new Date();
  else date = new Date(originDate);
  var year = date.getFullYear().toString();

  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month.toString() : month.toString();

  var day = date.getDate();
  day = day < 10 ? '0' + day.toString() : day.toString();

  return year + '-'+ month + '-'+ day ;
}

router.get('/api/getList', async(req, res) => {
  const today = getCurrentDate();
  var testDayPostList = await dayPostListModel.findOne({ date: today });
  if (testDayPostList == null) testDayPostList = new dayPostListModel({ date: today, idArray: [] });
  res.send(testDayPostList.idArray);
});

router.get('/api/getList/:date', async(req, res) => {
  const today = getCurrentDate(req.params.date);
  var testDayPostList = await dayPostListModel.findOne({ date: today });
  if (testDayPostList == null) testDayPostList = new dayPostListModel({ date: today, idArray: [] });
  res.send(testDayPostList.idArray);
});

router.get('/api/get', async(req, res) => {
  const idArray = req.body.idArray;
  var resultArray = [];
  for (const id of idArray){
    const onePost = await postModel.findById(id);
    var tempJSON = {};
    tempJSON.id = onePost.id;
    tempJSON.title = onePost.title;
    tempJSON.content = onePost.content;
    tempJSON.content = tempJSON.content.replace(/(?:\r\n|\r|\n)/g, '');
    const sliceLength = 10;
    if(tempJSON.content.length > sliceLength) tempJSON.content = tempJSON.content.slice(0,sliceLength) + "...";
    resultArray.push(tempJSON);
  }
  res.send(resultArray);
});

router.get('/api/get/:id', async(req, res) => {
  const currentPost = await postModel.findById(req.params.id);
  res.send({ title: currentPost.title, content: currentPost.content });
});

router.post('/api/isPassEqual', async(req, res) => {
  const currentPost = await postModel.findById(req.body.id);
  if (currentPost.password == req.body.password) res.send("success");
  else res.send("failed");
});

router.post('/api/postSave', async (req, res) => {
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

  res.send(newPostData);
});

// 게시물 수정, 삭제 추가예정 ---------------------------------------------------------------------------------------------------------------------------------------

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

