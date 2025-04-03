import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { FormsModule } from '@angular/forms';

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

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $designation: String!,
    $salary: Float!,
    $department: String!,
    $date_of_joining: String!,
    $gender: String!
  ) {
    addEmployee(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      designation: $designation,
      salary: $salary,
      department: $department,
      date_of_joining: $date_of_joining,
      gender: $gender
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

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Employee Management</h2>
    <div>
      <h3>Add Employee</h3>
      <form (ngSubmit)="addEmployee()">
        <input [(ngModel)]="newEmployee.first_name" name="first_name" placeholder="First Name" required />
        <input [(ngModel)]="newEmployee.last_name" name="last_name" placeholder="Last Name" required />
        <input [(ngModel)]="newEmployee.email" name="email" placeholder="Email" required />
        <input [(ngModel)]="newEmployee.designation" name="designation" placeholder="Designation" required />
        <input [(ngModel)]="newEmployee.salary" name="salary" type="number" placeholder="Salary" required />
        <input [(ngModel)]="newEmployee.department" name="department" placeholder="Department" required />
        <input [(ngModel)]="newEmployee.date_of_joining" name="date_of_joining" type="date" placeholder="Date of Joining" required />
        <select [(ngModel)]="newEmployee.gender" name="gender" required>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add Employee</button>
      </form>
    </div>
    <div>
      <h3>Employee List</h3>
      <button (click)="fetchEmployees()">Refresh List</button>
      <table border="1">
        <thead>
          <tr>
            <th>First Name</th><th>Last Name</th><th>Email</th><th>Designation</th><th>Salary</th><th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let emp of employees">
            <td>{{ emp.first_name }}</td>
            <td>{{ emp.last_name }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.designation }}</td>
            <td>{{ emp.salary }}</td>
            <td>{{ emp.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class EmployeeManagementComponent implements OnInit {
  employees: any[] = [];
  newEmployee = {
    first_name: '',
    last_name: '',
    email: '',
    designation: '',
    salary: 0,
    department: '',
    date_of_joining: '',
    gender: '',
  };

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEES,
      })
      .valueChanges.subscribe(
        ({ data }) => {
          this.employees = data.getAllEmployees;
        },
        (error) => {
          console.error('Error fetching employees', error);
        }
      );
  }

  addEmployee() {
    const variables = {
      ...this.newEmployee,
      salary: parseFloat(this.newEmployee.salary.toString()),
    };
    this.apollo
      .mutate<any>({
        mutation: ADD_EMPLOYEE,
        variables,
      })
      .subscribe(
        ({ data }) => {
          console.log('Employee added:', data);
          this.fetchEmployees();
          // Reset the form
          this.newEmployee = {
            first_name: '',
            last_name: '',
            email: '',
            designation: '',
            salary: 0,
            department: '',
            date_of_joining: '',
            gender: '',
          };
        },
        (error) => {
          console.error('Error adding employee', error);
        }
      );
  }
}
