  // src/app/models/employee.model.ts
  export interface Employee {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    designation: string;
    department: string;
    salary: number;
    date_of_joining: string;
    employee_photo?: string;
    created_at?: string;
    updated_at?: string;
  }