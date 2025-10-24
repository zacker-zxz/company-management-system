const User = require('../models/User');

const processPayroll = async (req, res) => {
  try {
    // Get all active employees
    const employees = await User.findAll();
    const activeEmployees = employees.filter(emp => emp.role === 'employee' && emp.isActive);

    if (activeEmployees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active employees found'
      });
    }

    // Calculate payroll summary
    const totalPayroll = activeEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    const processedEmployees = activeEmployees.length;

    // In a real system, you would:
    // 1. Create payroll records in database
    // 2. Generate payslips
    // 3. Send notifications
    // 4. Update payment status

    // For now, we'll simulate the process
    const payrollData = {
      period: new Date().toISOString().slice(0, 7), // YYYY-MM format
      processedEmployees,
      totalAmount: totalPayroll,
      processedAt: new Date(),
      status: 'completed'
    };

    res.json({
      success: true,
      message: `Payroll processed successfully for ${processedEmployees} employees`,
      data: payrollData
    });

  } catch (error) {
    console.error('Process payroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getPayrollSummary = async (req, res) => {
  try {
    const employees = await User.findAll();
    const activeEmployees = employees.filter(emp => emp.role === 'employee' && emp.isActive);

    const totalPayroll = activeEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    const pendingPayments = activeEmployees.filter(emp => emp.salary && emp.salary > 0).length;

    res.json({
      success: true,
      data: {
        totalEmployees: activeEmployees.length,
        totalPayroll,
        pendingPayments,
        lastProcessed: new Date().toISOString().slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Get payroll summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getEmployeePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findById(id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Calculate deductions (simplified)
    const baseSalary = employee.salary || 0;
    const taxDeduction = baseSalary * 0.1; // 10% tax
    const insuranceDeduction = 200; // Fixed insurance
    const totalDeductions = taxDeduction + insuranceDeduction;
    const netSalary = baseSalary - totalDeductions;

    res.json({
      success: true,
      data: {
        employeeId: employee._id.toString(),
        employeeName: employee.name,
        baseSalary,
        deductions: {
          tax: taxDeduction,
          insurance: insuranceDeduction,
          total: totalDeductions
        },
        netSalary,
        payPeriod: new Date().toISOString().slice(0, 7)
      }
    });

  } catch (error) {
    console.error('Get employee payroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  processPayroll,
  getPayrollSummary,
  getEmployeePayroll
};