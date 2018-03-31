const Datastore = require('nedb')
const path = require('path')

module.exports = async () => {
  const choiceDb = new Datastore({
    filename: path.resolve(__dirname, './db/choice.db'),
    autoload: true,
    timestampData: true
  });

  return {
    choices: choiceDb
  };
}