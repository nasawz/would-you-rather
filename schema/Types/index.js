const typeDefs = `
  
  type Choice {
    id: ID!
    a: String!
    b: String!
    num_a: Int!
    num_b: Int!
  }

  type Query {
    allChoices: [Choice]!
    getChoice(id: String!):Choice!
  }  

  type Mutation {
    createChoice(data: ChoiceInput!): Choice
    editChoice(id:String!, data: ChoiceInput!): Choice
    removeChoice(id:String!): Int!
  }
  input ChoiceInput {
    a: String!
    b: String!
    num_a: Int!
    num_b: Int!
  }  
`
module.exports = typeDefs

