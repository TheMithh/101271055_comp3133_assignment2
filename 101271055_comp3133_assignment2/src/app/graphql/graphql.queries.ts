// src/app/graphql/graphql.queries.ts
import { gql } from 'apollo-angular';

// Authentication Queries
export const LOGIN_QUERY = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

// Employee Queries
export const GET_ALL_EMPLOYEES = gql`
  query getAllEmployees {
    getAllEmployees {
      id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query getEmployeeByEid($id: ID!) {
    getEmployeeByEid(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query searchEmployeeByDeptOrDesg($department: String, $designation: String) {
    searchEmployeeByDeptOrDesg(department: $department, designation: $designation) {
      id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
    }
  }
`;

// Employee Mutations
export const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $designation: String!
    $department: String!
    $salary: Float!
    $date_of_joining: String!
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      department: $department
      salary: $salary
      date_of_joining: $date_of_joining
      employee_photo: $employee_photo
    ) {
      id
      first_name
      last_name
      email
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee($id: ID!, $salary: Float, $designation: String) {
    updateEmployee(id: $id, salary: $salary, designation: $designation) {
      id
      first_name
      last_name
      salary
      designation
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;