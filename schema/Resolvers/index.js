var _ = require('lodash')
module.exports = {
  Query: {
    allChoices: async (root, { }, { db: { choices } }) => {
      return new Promise((resolve, reject) => {
        choices
          .find({})
          .exec((err, res) => (err ? reject(err) : resolve(res)));
      })
    },
    getChoice: async (root, { id }, { db: { choices } }) => {
      return new Promise((resolve, reject) => {
        choices
          .findOne({ _id: id })
          .exec((err, res) => (err ? reject(err) : resolve(res)));
      })
    }
  },
  Mutation: {
    createChoice: async (root, { data: { a, b, num_a, num_b } }, { db: { choices } }) => {
      return new Promise((resolve, reject) => {
        choices
          .insert({ a, b, num_a, num_b }, (err, res) => (err ? reject(err) : resolve(res)))
      })
    },
    editChoice: async (root, { id, data }, { db: { choices } }) => {
      return new Promise((resolve, reject) => {
        choices
          .update({ _id: id }, { $set: data }, { returnUpdatedDocs: true, multi: false }, (err, numAffected, affectedDocuments) => (err ? reject(err) : resolve(affectedDocuments)))
      })
    },
    removeChoice: async (root, { id, }, { db: { choices } }) => {
      return new Promise((resolve, reject) => {
        choices
          .remove({ _id: id }, {}, (err, numRemoved) => (err ? reject(err) : resolve(numRemoved)))
      })
    }
  },
  Choice: {
    id: root => root._id || root.id
  }
}