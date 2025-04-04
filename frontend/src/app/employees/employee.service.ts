import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Employee } from '../shared/models/employee.model';

const GET_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      id
      first_name
      last_name
      email
      designation
      salary
      department
    }
  }
`;

const GET_EMPLOYEE = gql`
  query GetEmployeeById($id: ID!) {
    getEmployeeByEid(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($department: String, $designation: String) {
    searchEmployeeByDeptOrDesg(department: $department, designation: $designation) {
      id
      first_name
      last_name
      email
      designation
      salary
      department
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $designation: String!,
    $salary: Float!,
    $department: String!,
    $date_of_joining: String!,
    $gender: String!,
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      designation: $designation,
      salary: $salary,
      department: $department,
      date_of_joining: $date_of_joining,
      gender: $gender,
      employee_photo: $employee_photo
    ) {
      id
      first_name
      last_name
      email
      designation
      salary
      department
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!, 
    $first_name: String, 
    $last_name: String, 
    $email: String, 
    $gender: String, 
    $designation: String, 
    $salary: Float, 
    $department: String, 
    $date_of_joining: String,
    $employee_photo: String
  ) {
    updateEmployee(
      id: $id,
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      department: $department,
      date_of_joining: $date_of_joining,
      employee_photo: $employee_photo
    ) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      department
      date_of_joining
      employee_photo
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apollo = inject(Apollo);

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES
    })
    .valueChanges
    .pipe(
      map(result => result.data.getAllEmployees),
      catchError(error => throwError(() => error))
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE,
      variables: { id }
    })
    .valueChanges
    .pipe(
      map(result => result.data.getEmployeeByEid),
      catchError(error => throwError(() => error))
    );
  }

  searchEmployees(department?: string, designation?: string): Observable<Employee[]> {
    return this.apollo.watchQuery<any>({
      query: SEARCH_EMPLOYEES,
      variables: { department, designation }
    })
    .valueChanges
    .pipe(
      map(result => result.data.searchEmployeeByDeptOrDesg),
      catchError(error => throwError(() => error))
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.apollo.mutate<any>({
      mutation: ADD_EMPLOYEE,
      variables: {
        ...employee
      },
      refetchQueries: [
        { query: GET_EMPLOYEES }
      ]
    })
    .pipe(
      map(result => result.data?.addEmployee as Employee),
      catchError(error => throwError(() => error))
    );
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id,
        ...employee
      },
      refetchQueries: [
        { query: GET_EMPLOYEES }
      ]
    })
    .pipe(
      map(result => result.data?.updateEmployee as Employee),
      catchError(error => throwError(() => error))
    );
  }
  deleteEmployee(id: string): Observable<string> {
    return this.apollo.mutate<any>({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [
        { query: GET_EMPLOYEES }
      ]
    })
    .pipe(
      map(result => result.data?.deleteEmployee as string),
      catchError(error => throwError(() => error))
    );
  }
}