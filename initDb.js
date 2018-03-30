const Datastore = require('nedb')
const path = require('path')
//初始化机器类型数据
const choiceDb = new Datastore({
  filename: path.resolve(__dirname, './db/choice.db'),
  autoload: true,
  timestampData: true
});

choiceDb.insert([
  { a: '真爱', b: '一千万', num_a: 0, num_b: 0 },
  { a: '精彩的活十年', b: '庸碌的活一百年', num_a: 0, num_b: 0 },
], (err, res) => {
  console.log(res);
});
