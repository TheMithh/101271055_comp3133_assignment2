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
    getAllEmployees: async () => {
      const employees = await Employee.find();
      return employees.map(employee => {
        const result = employee.toObject();
        result.id = employee._id.toString();
        return result;
      });
    },
   // In resolvers/index.js
// In resolvers/index.js
// In resolvers/index.js
getEmployeeByEid: async (_, { id }) => {
  try {
    const employee = await Employee.findById(id);
    if (!employee) return null;
    
    // Convert to plain object
    const result = employee.toObject();
    result.id = employee._id.toString();
    
    // Format dates consistently as ISO strings
    if (result.date_of_joining) {
      // Convert any timestamp/date to ISO string
      const date = new Date(result.date_of_joining);
      result.date_of_joining = !isNaN(date.getTime()) ? date.toISOString() : result.date_of_joining;
    }
    
    if (result.created_at) {
      const date = new Date(result.created_at);
      result.created_at = !isNaN(date.getTime()) ? date.toISOString() : result.created_at;
    }
    
    if (result.updated_at) {
      const date = new Date(result.updated_at);
      result.updated_at = !isNaN(date.getTime()) ? date.toISOString() : result.updated_at;
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching employee: ${error.message}`);
    throw new Error('Failed to fetch employee details');
  }
},
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
      try {
        const employeeData = {...args};
        
        // Parse date strings to Date objects
        if (employeeData.date_of_joining) {
          employeeData.date_of_joining = new Date(employeeData.date_of_joining);
        }
        
        // Set timestamps
        employeeData.created_at = new Date();
        employeeData.updated_at = new Date();
        
        const employee = new Employee(employeeData);
        await employee.save();
        return employee;
      } catch (error) {
        console.error(`Error adding employee: ${error.message}`);
        throw new Error('Failed to add employee');
      }
    },
    // In resolvers/index.js
updateEmployee: async (_, { id, ...updateFields }) => {
  try {
    // Parse date_of_joining if provided
    if (updateFields.date_of_joining) {
      updateFields.date_of_joining = new Date(updateFields.date_of_joining);
    }
    
    // Always update the updated_at timestamp
    updateFields.updated_at = new Date();
    
    const employee = await Employee.findByIdAndUpdate(
      id, 
      updateFields, 
      { new: true }
    );
    
    if (!employee) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    
    // Convert to object and ensure ID is set
    const result = employee.toObject();
    result.id = employee._id.toString();
    
    return result;
  } catch (error) {
    console.error(`Error updating employee: ${error.message}`);
    throw new Error('Failed to update employee');
  }
},
    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted successfully";
    },
  },
};

module.exports = resolvers;
