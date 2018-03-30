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
      var choice = this.getSlot('choice')
      if (choice) {
        this.endSession()
        return {
          outputSpeech: `
            共有46%的人和你一样选择了${choice}
            `
        }
      } else {
        return {
          outputSpeech: `
            真爱和一千万，您选择哪个？
            `,
          reprompt: `
            真爱和一千万，您选择哪个？
            `,
        }
      }
    });
  }
}

module.exports = Bot;
