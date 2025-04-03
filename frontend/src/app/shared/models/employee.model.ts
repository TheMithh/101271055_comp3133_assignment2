export interface Employee {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    designation: string;
    salary: number;
    date_of_joining: Date | string;
    department: string;
    employee_photo?: string;
    created_at?: Date;
    updated_at?: Date;
  }