const express = require('express');

const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const connectDb = require('./db-connector');
const schema = require('./schema');



const start = async () => {

  const Bot = require('./Bot');
  var app = express();
  // 探活请求
  app.head('/', (req, res) => {
    // console.log(req);
    res.sendStatus(204);
  });
  app.get('/', (req, res) => {
    res.send('ok')
  });

  const db = await connectDb();
  const buildOptions = async (req, res) => {
    return {
      context: {
        db,
      },
      schema,
    };
  };

  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));


  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));

  app.post('/', (req, res) => {
    req.rawBody = '';

    req.setEncoding('utf8');
    req.on('data', function (chunk) {
      req.rawBody += chunk;
    });

    req.on('end', function () {
      var requestBody;
      try {
        requestBody = JSON.parse(req.rawBody);
        console.log(requestBody);
      } catch (e) {
        console.error(e);
        return res.send(JSON.stringify({ status: 1 }));
      }

      var bot = new Bot(requestBody, db.choices);
      // 开启签名认证
      // bot.initCertificate(req.headers, req.rawBody).enableVerifyRequestSign();


      /**
       * 需要监控功能
       * 
       * bot-sdk 集成了监控sdk，参考：https://www.npmjs.com/package/bot-monitor-sdk
       * 打开此功能，对服务的性能有一定的耗时增加。另外，需要在DBP平台上面上传public key，这里使用私钥签名
       * 文档参考：https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-deploy/authentication_markdown
       */
      // bot.setPrivateKey(__dirname + '/rsa_private_key.pem').then(function(key){
      //     // 0: debug  1: online
      //     bot.botMonitor.setEnvironmentInfo(key, 0);

      //     bot.run().then(function(result){
      //         res.send(result);
      //     });
      // }, function(err){
      //     console.error('error'); 
      // });


      // 不需要监控
      bot.run().then(function (result) {
        console.log(result);
        res.send(result);
      });
    });
  })

  app.listen(8100, () => {
    console.log('listen 8100');
  });
}

start();





