// resolvers/index.js
const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token, user };
    },
    getAllEmployees: async () => await Employee.find(),
    getEmployeeByEid: async (_, { id }) => await Employee.findById(id),
    searchEmployeeByDeptOrDesg: async (_, { department, designation }) => {
      const filter = {};
      if (department) filter.department = department;
      if (designation) filter.designation = designation;
      return await Employee.find(filter);
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return user;
    },
    addEmployee: async (_, args) => {
      const employee = new Employee(args);
      await employee.save();
      return employee;
    },
    updateEmployee: async (_, { 
      id, 
      first_name, 
      last_name, 
      email, 
      gender, 
      designation, 
      salary, 
      department, 
      date_of_joining,
      employee_photo 
    }) => {
      const updateFields = {};
      
      if (first_name !== undefined) updateFields.first_name = first_name;
      if (last_name !== undefined) updateFields.last_name = last_name;
      if (email !== undefined) updateFields.email = email;
      if (gender !== undefined) updateFields.gender = gender;
      if (designation !== undefined) updateFields.designation = designation;
      if (salary !== undefined) updateFields.salary = salary;
      if (department !== undefined) updateFields.department = department;
      if (date_of_joining !== undefined) updateFields.date_of_joining = date_of_joining;
      if (employee_photo !== undefined) updateFields.employee_photo = employee_photo;
      
      // Add updated_at timestamp
      updateFields.updated_at = new Date();
      
      return await Employee.findByIdAndUpdate(id, updateFields, { new: true });
    },
    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted successfully";
    },
  },
};

module.exports = resolvers;
