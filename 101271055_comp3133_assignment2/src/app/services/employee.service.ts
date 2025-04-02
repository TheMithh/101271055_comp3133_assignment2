// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Employee } from '../models/employee.model';
import { 
  GET_ALL_EMPLOYEES, 
  GET_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../graphql/graphql.queries';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<{ getAllEmployees: Employee[] }>({
      query: GET_ALL_EMPLOYEES
    })
    .valueChanges
    .pipe(
      map(result => result.data.getAllEmployees)
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.watchQuery<{ getEmployeeByEid: Employee }>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    })
    .valueChanges
    .pipe(
      map(result => result.data.getEmployeeByEid)
    );
  }

  searchEmployees(department?: string, designation?: string): Observable<Employee[]> {
    return this.apollo.watchQuery<{ searchEmployeeByDeptOrDesg: Employee[] }>({
      query: SEARCH_EMPLOYEES,
      variables: { department, designation }
    })
    .valueChanges
    .pipe(
      map(result => result.data.searchEmployeeByDeptOrDesg)
    );
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.apollo.mutate<{ addEmployee: Employee }>({
      mutation: ADD_EMPLOYEE,
      variables: employee,
      refetchQueries: [
        { query: GET_ALL_EMPLOYEES }
      ]
    })
    .pipe(
      map(result => result.data?.addEmployee as Employee)
    );
  }

  updateEmployee(id: string, salary?: number, designation?: string): Observable<Employee> {
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, salary, designation },
      refetchQueries: [
        { query: GET_ALL_EMPLOYEES }
      ]
    })
    .pipe(
      map(result => result.data?.updateEmployee as Employee)
    );
  }

  deleteEmployee(id: string): Observable<string> {
    return this.apollo.mutate<{ deleteEmployee: string }>({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [
        { query: GET_ALL_EMPLOYEES }
      ]
    })
    .pipe(
      map(result => result.data?.deleteEmployee as string)
    );
  }
}