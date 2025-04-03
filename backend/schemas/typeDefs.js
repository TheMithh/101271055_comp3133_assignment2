// schemas/typeDefs.js
const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    department: String!
    date_of_joining: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    login(username: String!, password: String!): AuthPayload
    getAllEmployees: [Employee]
    getEmployeeByEid(id: ID!): Employee
    searchEmployeeByDeptOrDesg(department: String, designation: String): [Employee]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    addEmployee(
      first_name: String!,
      last_name: String!,
      email: String!,
      designation: String!,
      salary: Float!,
      department: String!,
      date_of_joining: String!,
      gender: String!,
      employee_photo: String
    ): Employee
    updateEmployee(id: ID!, salary: Float, designation: String): Employee
    deleteEmployee(id: ID!): String
  }
`;

module.exports = typeDefs;
