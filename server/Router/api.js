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

router.get('/api/getAll', (req, res) => {
  dayPostListModel.find(function (error, dayPostLists) {
    console.log('--- Read all ---');
    if (error) {
      res.send(error);
    } else {
      res.send(dayPostLists);
    }
  })
});

router.get('/api/testSave', async(req, res) => {
  var isFirst = false;

  var testDayPostList = await dayPostListModel.findOne({date: '2022-05-30'});
  if(testDayPostList == null){
    testDayPostList = new dayPostListModel({ date: '2022-05-30', idArray: [] });
    isFirst = true;
  }
  var postListArr = testDayPostList.idArray;

  var newPost = new postModel({ date: '2022-05-30', title: '테스트 제목', age: '테스트 내용', password: 'password' });
  var newPostData = await newPost.save();
  postListArr.push(newPostData._id.toString());

  if(isFirst) await testDayPostList.save();
  else await dayPostListModel.updateOne({date: '2022-05-30'},{idArray: postListArr});
  
  res.send("test");
});

module.exports = router;

