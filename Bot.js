var BaseBot = require('bot-sdk');
var Datastore = require('nedb');
var _ = require('lodash');
var choiceDb = new Datastore({ filename: 'db/choice.db', autoload: true });


class Bot extends BaseBot {
  constructor(postData) {
    super(postData);
    console.log(postData.context.System.user);
    console.log(postData.context.System.user.userInfo);

    // console.log('this.request.getUserId()', this.request.getUserId());

    this.addLaunchHandler(() => {
      this.waitAnswer()
      return {
        outputSpeech: '开始游戏请说：开始',
        reprompt: '开始游戏请说：开始'
      };
    });

    this.addSessionEndedHandler(() => {
      return {
        outputSpeech: '再见'
      }
    })

    this.addIntentHandler('choice', () => {
      this.waitAnswer()
      let answer = this.getSlot('answer')
      let doc = this.getSessionAttribute('doc')
      if (answer && doc) {
        let num_a = doc.num_a
        let num_b = doc.num_b
        let corps = '多数派'
        let percent = 0
        let choise = ''
        if (answer == 'a') {
          num_a++
          corps = num_a > num_b ? '多数派' : '少数派'
          percent = _.floor(num_a / (num_a + num_b) * 100, 1)
          choise = doc.a
        } else {
          num_b++
          corps = num_b > num_a ? '多数派' : '少数派'
          percent = _.floor(num_b / (num_a + num_b) * 100, 1)
          choise = doc.b
        }
        choiceDb
          .update({ _id: doc._id }, { $set: { num_a: num_a, num_b: num_b } }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments) => (err ? console.log(err) : console.log(affectedDocuments)))
        this.endSession()
        return {
          outputSpeech: `共有${percent}%的人和你一样选择了${choise},你是${corps}。`
        }
      } else {
        this.waitAnswer()
        let self = this
        return new Promise((resolve, reject) => {
          choiceDb.find({}, (err, docs) => {
            let doc = _.sample(docs)
            self.setSessionAttribute('doc', doc)
            console.log(doc);
            let outputSpeech = `请听题。a,${doc.a}。和。b,${doc.b}。你选哪个？`
            resolve({
              outputSpeech: outputSpeech,
              reprompt: '选a, 还是选b呢？',
            })
          })
        })

      }
    });
  }
}

module.exports = Bot;
