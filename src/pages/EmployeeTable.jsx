// EmployeeTable.jsx
import { useState, useMemo } from "react";
import {
  MdDeleteOutline,
  MdAdd,
  MdSearch,
  MdEmail,
  MdPhone,
  MdWork,
  MdLocationOn,
  MdPerson,
  MdSave,
  MdCancel,
  MdSchool,
  MdAccessTime,
  MdAccountBalance,
  MdLock,
} from "react-icons/md";
import { FaSortAlphaDown, FaSortAlphaDownAlt, FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

export default function EmployeeTable() {
  // Mock data for 10 employees based on ERD
  const [employeesData, setEmployeesData] = useState([
    {
      id: 1,
      UserId: 1,
      DepartmentId: 1,
      JobTitleId: 1,
      Name: "Ahmed Mohamed",
      Email: "ahmed@company.com",
      PhoneNumber: "+1234567890",
      Gender: "Male",
      address: "123 Main St, City",
      academicAchievement: "Bachelor's in Computer Science",
      startWorkingHours: "08:00",
      workshift: "Morning",
      endWorkingHours: "16:00",
      WithSalary: true,
      IsAdmin: false,
      salary: "$5,000",
      UserName: "ahmed.m",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2023-01-15",
      UpdatedAt: "2023-12-01",
      departmentName: "Development",
      jobTitle: "Programmer",
      status: "Active",
      skills: ["JavaScript", "React", "Node.js"],
    },
    {
      id: 2,
      UserId: 2,
      DepartmentId: 2,
      JobTitleId: 2,
      Name: "Sara Ali",
      Email: "sara@company.com",
      PhoneNumber: "+1234567891",
      Gender: "Female",
      address: "456 Park Ave, City",
      academicAchievement: "Bachelor's in Graphic Design",
      startWorkingHours: "09:00",
      workshift: "Morning",
      endWorkingHours: "17:00",
      WithSalary: true,
      IsAdmin: true,
      salary: "$4,500",
      UserName: "sara.a",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2022-03-20",
      UpdatedAt: "2023-12-01",
      departmentName: "Design",
      jobTitle: "UI/UX Designer",
      status: "Admin",
      skills: ["Figma", "Adobe XD", "Photoshop"],
    },
    {
      id: 3,
      UserId: 3,
      DepartmentId: 3,
      JobTitleId: 3,
      Name: "Khaled Saeed",
      Email: "khaled@company.com",
      PhoneNumber: "+1234567892",
      Gender: "Male",
      address: "789 Oak St, City",
      academicAchievement: "MBA",
      startWorkingHours: "08:30",
      workshift: "Morning",
      endWorkingHours: "16:30",
      WithSalary: true,
      IsAdmin: true,
      salary: "$6,000",
      UserName: "khaled.s",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2021-11-10",
      UpdatedAt: "2023-12-01",
      departmentName: "Sales",
      jobTitle: "Sales Manager",
      status: "Admin",
      skills: ["Negotiation", "CRM", "Leadership"],
    },
    {
      id: 4,
      UserId: 4,
      DepartmentId: 4,
      JobTitleId: 4,
      Name: "Nour Mohamed",
      Email: "nour@company.com",
      PhoneNumber: "+1234567893",
      Gender: "Female",
      address: "321 Elm St, City",
      academicAchievement: "Bachelor's in Quality Engineering",
      startWorkingHours: "07:00",
      workshift: "Morning",
      endWorkingHours: "15:00",
      WithSalary: true,
      IsAdmin: false,
      salary: "$3,800",
      UserName: "nour.m",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2023-05-05",
      UpdatedAt: "2023-12-01",
      departmentName: "Quality",
      jobTitle: "Quality Controller",
      status: "Employee",
      skills: ["Testing", "QA", "Automation"],
    },
    {
      id: 5,
      UserId: 5,
      DepartmentId: 5,
      JobTitleId: 5,
      Name: "Omar Hassan",
      Email: "omar@company.com",
      PhoneNumber: "+1234567894",
      Gender: "Male",
      address: "654 Pine St, City",
      academicAchievement: "Diploma in IT Support",
      startWorkingHours: "10:00",
      workshift: "Evening",
      endWorkingHours: "18:00",
      WithSalary: true,
      IsAdmin: false,
      salary: "$3,500",
      UserName: "omar.h",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2023-08-12",
      UpdatedAt: "2023-12-01",
      departmentName: "Support",
      jobTitle: "Technical Support",
      status: "Employee",
      skills: ["Troubleshooting", "Customer Service", "Networking"],
    },
    {
      id: 6,
      UserId: 6,
      DepartmentId: 6,
      JobTitleId: 6,
      Name: "Fatima Kamal",
      Email: "fatima@company.com",
      PhoneNumber: "+1234567895",
      Gender: "Female",
      address: "987 Cedar St, City",
      academicAchievement: "Master's in Business Analysis",
      startWorkingHours: "08:00",
      workshift: "Morning",
      endWorkingHours: "16:00",
      WithSalary: true,
      IsAdmin: true,
      salary: "$5,500",
      UserName: "fatima.k",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2022-07-30",
      UpdatedAt: "2023-12-01",
      departmentName: "Analysis",
      jobTitle: "Systems Analyst",
      status: "Admin",
      skills: ["Analysis", "SQL", "Process Improvement"],
    },
    {
      id: 7,
      UserId: 7,
      DepartmentId: 1,
      JobTitleId: 7,
      Name: "Mahmoud Abdullah",
      Email: "mahmoud@company.com",
      PhoneNumber: "+1234567896",
      Gender: "Male",
      address: "147 Maple St, City",
      academicAchievement: "Bachelor's in Database Management",
      startWorkingHours: "08:00",
      workshift: "Morning",
      endWorkingHours: "16:00",
      WithSalary: true,
      IsAdmin: false,
      salary: "$5,200",
      UserName: "mahmoud.a",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2023-02-18",
      UpdatedAt: "2023-12-01",
      departmentName: "Development",
      jobTitle: "Database Administrator",
      status: "Employee",
      skills: ["MySQL", "PostgreSQL", "MongoDB"],
    },
    {
      id: 8,
      UserId: 8,
      DepartmentId: 7,
      JobTitleId: 8,
      Name: "Huda Youssef",
      Email: "huda@company.com",
      PhoneNumber: "+1234567897",
      Gender: "Female",
      address: "258 Birch St, City",
      academicAchievement: "Bachelor's in Marketing",
      startWorkingHours: "09:00",
      workshift: "Morning",
      endWorkingHours: "17:00",
      WithSalary: true,
      IsAdmin: false,
      salary: "$4,000",
      UserName: "huda.y",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2023-04-22",
      UpdatedAt: "2023-12-01",
      departmentName: "Marketing",
      jobTitle: "Digital Marketer",
      status: "Employee",
      skills: ["SEO", "Social Media", "Content Marketing"],
    },
    {
      id: 9,
      UserId: 9,
      DepartmentId: 8,
      JobTitleId: 9,
      Name: "Yasser Nasser",
      Email: "yasser@company.com",
      PhoneNumber: "+1234567898",
      Gender: "Male",
      address: "369 Walnut St, City",
      academicAchievement: "PMP Certified",
      startWorkingHours: "08:00",
      workshift: "Morning",
      endWorkingHours: "16:00",
      WithSalary: true,
      IsAdmin: true,
      salary: "$7,000",
      UserName: "yasser.n",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2020-09-15",
      UpdatedAt: "2023-12-01",
      departmentName: "Project Management",
      jobTitle: "Project Manager",
      status: "Admin",
      skills: ["Agile", "Scrum", "Budget Management"],
    },
    {
      id: 10,
      UserId: 10,
      DepartmentId: 9,
      JobTitleId: 10,
      Name: "Laila Ahmed",
      Email: "laila@company.com",
      PhoneNumber: "+1234567899",
      Gender: "Female",
      address: "741 Spruce St, City",
      academicAchievement: "Master's in HR Management",
      startWorkingHours: "08:30",
      workshift: "Morning",
      endWorkingHours: "16:30",
      WithSalary: true,
      IsAdmin: true,
      salary: "$6,500",
      UserName: "laila.a",
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: "2021-12-01",
      UpdatedAt: "2023-12-01",
      departmentName: "Human Resources",
      jobTitle: "HR Manager",
      status: "Admin",
      skills: ["Recruitment", "Employee Relations", "HR Policies"],
    },
  ]);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "asc", // asc or desc
  });

  // State for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // "all", "Employee", "Admin"
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // State for add employee modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    Gender: "Male",
    address: "",
    academicAchievement: "",
    startWorkingHours: "08:00",
    workshift: "Morning",
    endWorkingHours: "16:00",
    WithSalary: true,
    IsAdmin: false,
    salary: "",
    UserName: "",
    Password: "",
    departmentName: "Development",
    jobTitle: "Programmer",
  });

  // State for view employee details modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // State for edit employee modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    address: "",
    academicAchievement: "",
    startWorkingHours: "",
    workshift: "",
    endWorkingHours: "",
    WithSalary: true,
    IsAdmin: false,
    salary: "",
    UserName: "",
    Password: "",
    departmentName: "",
    jobTitle: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = [...new Set(employeesData.map((emp) => emp.departmentName))];
    return depts;
  }, [employeesData]);

  // Get unique job titles for filter
  const jobTitles = useMemo(() => {
    const titles = [...new Set(employeesData.map((emp) => emp.jobTitle))];
    return titles;
  }, [employeesData]);

  // Sort and filter employees
  const sortedAndFilteredEmployees = useMemo(() => {
    let filtered = employeesData.filter((employee) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.departmentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "Admin" ? employee.IsAdmin : !employee.IsAdmin);

      // Department filter
      const matchesDepartment =
        selectedDepartment === "all" ||
        employee.departmentName === selectedDepartment;

      return matchesSearch && matchesStatus && matchesDepartment;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    employeesData,
    sortConfig,
    searchTerm,
    selectedStatus,
    selectedDepartment,
  ]);

  // Calculate employees for current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedAndFilteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Calculate total pages
  const totalPages = Math.ceil(
    sortedAndFilteredEmployees.length / employeesPerPage
  );

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle delete employee
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployeesData(employeesData.filter((emp) => emp.id !== id));
    }
  };

  // Handle view employee details
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // Handle edit employee
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      Name: employee.Name,
      Email: employee.Email,
      PhoneNumber: employee.PhoneNumber,
      Gender: employee.Gender,
      address: employee.address,
      academicAchievement: employee.academicAchievement,
      startWorkingHours: employee.startWorkingHours,
      workshift: employee.workshift,
      endWorkingHours: employee.endWorkingHours,
      WithSalary: employee.WithSalary,
      IsAdmin: employee.IsAdmin,
      salary: employee.salary,
      UserName: employee.UserName,
      Password: employee.Password,
      departmentName: employee.departmentName,
      jobTitle: employee.jobTitle,
    });
    setShowEditModal(true);
  };

  // Handle save edited employee
  const handleSaveEdit = () => {
    if (!editFormData.Name.trim() || !editFormData.Email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedEmployee = {
      ...editingEmployee,
      ...editFormData,
    };

    setEmployeesData(
      employeesData.map((emp) =>
        emp.id === editingEmployee.id ? updatedEmployee : emp
      )
    );
    setShowEditModal(false);
    setEditingEmployee(null);
    setEditFormData({
      Name: "",
      Email: "",
      PhoneNumber: "",
      Gender: "",
      address: "",
      academicAchievement: "",
      startWorkingHours: "",
      workshift: "",
      endWorkingHours: "",
      WithSalary: true,
      IsAdmin: false,
      salary: "",
      UserName: "",
      Password: "",
      departmentName: "",
      jobTitle: "",
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedDepartment("all");
    setSortConfig({ key: "Name", direction: "asc" });
    setCurrentPage(1);
  };

  // Handle add employee
  const handleAddEmployee = () => {
    if (!newEmployee.Name.trim() || !newEmployee.Email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const newEmp = {
      id:
        employeesData.length > 0
          ? Math.max(...employeesData.map((e) => e.id)) + 1
          : 1,
      UserId:
        employeesData.length > 0
          ? Math.max(...employeesData.map((e) => e.UserId)) + 1
          : 1,
      DepartmentId: departments.indexOf(newEmployee.departmentName) + 1,
      JobTitleId: jobTitles.indexOf(newEmployee.jobTitle) + 1,
      ...newEmployee,
      Password: "••••••••",
      RememberToken: null,
      FcmToken: null,
      CreatedAt: new Date().toISOString().split("T")[0],
      UpdatedAt: new Date().toISOString().split("T")[0],
      status: newEmployee.IsAdmin ? "Admin" : "Employee",
      skills: ["New Employee"],
    };

    setEmployeesData([...employeesData, newEmp]);
    setShowAddModal(false);
    setNewEmployee({
      Name: "",
      Email: "",
      PhoneNumber: "",
      Gender: "Male",
      address: "",
      academicAchievement: "",
      startWorkingHours: "08:00",
      workshift: "Morning",
      endWorkingHours: "16:00",
      WithSalary: true,
      IsAdmin: false,
      salary: "",
      UserName: "",
      Password: "",
      departmentName: "Development",
      jobTitle: "Programmer",
    });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const columns = [
    { key: "num", label: "Num." },
    {
      key: "Name",
      label: "Name",
      sortable: true,
    },
    { key: "jobTitle", label: "Job Title" },
    {
      key: "departmentName",
      label: "Department",
    },
    { key: "Gender", label: "Gender" },
    {
      key: "status",
      label: "Status",
    },
    { key: "action", label: "Action" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-6">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* تحسين لون النص في جميع الحقول */
        input,
        select,
        textarea {
          color: #1f2937 !important; /* gray-800 */
        }

        input::placeholder,
        select::placeholder {
          color: #9ca3af !important; /* gray-400 */
        }

        input:focus,
        select:focus {
          color: #111827 !important; /* gray-900 */
        }

        /* زر الحذف في حقل البحث */
        .clear-search-btn:hover {
          background-color: #f3f4f6;
          border-radius: 50%;
          padding: 2px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="padding w-screen h-36"></div>
        {/* Dashboard Header with Search */}
        <div className="mb-6 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-36 ">
                Employees Table
              </h1>
              <p className="w-full h-4"></p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="        Search"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-800 placeholder-gray-500"
                />
                {/* أيقونة البحث على اليسار */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <MdSearch className="text-gray-400 text-xl" />
                </div>

                {/* زر الحذف (X) على اليمين */}
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="clear-search-btn absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search hints */}
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  Found {sortedAndFilteredEmployees.length} employee
                  {sortedAndFilteredEmployees.length !== 1 ? "s" : ""} matching
                  "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-4 mt-2"></div>
              </div>

              {/* Add Employee Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-100 text-gray-800 rounded-lg hover:bg-cyan-200 transition-all duration-150 shadow-sm hover:shadow-md"
              >
                <MdAdd className="text-xl text-white" />
                <span className="font-medium text-white">Add Employee</span>
              </button>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-6 py-4 text-gray-700 font-medium text-sm ${
                        col.key === "action" ? "" : "text-right"
                      }`}
                    >
                      {col.key === "action" ? (
                        <div className="flex items-center justify-center pr-8">
                          <span>{col.label}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <span>{col.label}</span>

                          {/* Sort icon for name column */}
                          {col.sortable && (
                            <button
                              onClick={() => handleSort(col.key)}
                              className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors duration-150"
                              title={`Sort ${
                                sortConfig.key === col.key
                                  ? sortConfig.direction === "asc"
                                    ? "A to Z"
                                    : "Z to A"
                                  : "Sort by name"
                              }`}
                            >
                              <div className="relative flex flex-col items-center">
                                <FaSortAlphaDown
                                  className={`h-3 w-3 transition-all duration-200 ${
                                    sortConfig.key === col.key &&
                                    sortConfig.direction === "asc"
                                      ? "text-blue-600"
                                      : "text-gray-400 hover:text-gray-600"
                                  }`}
                                />
                                <FaSortAlphaDownAlt
                                  className={`h-3 w-3 -mt-1 transition-all duration-200 ${
                                    sortConfig.key === col.key &&
                                    sortConfig.direction === "desc"
                                      ? "text-blue-600"
                                      : "text-gray-400 hover:text-gray-600"
                                  }`}
                                />

                                {/* Active sort indicator */}
                                {sortConfig.key === col.key && (
                                  <div className="absolute -right-1 -top-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </button>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-gray-600 text-sm text-right">
                        {indexOfFirstEmployee + index + 1}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {employee.Name}
                          </span>
                          {/* Highlight search term in name */}
                          {searchTerm &&
                            employee.Name.toLowerCase().includes(
                              searchTerm.toLowerCase()
                            ) && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                                Match
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm text-right">
                        {employee.jobTitle}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm text-right">
                        {employee.departmentName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm text-right">
                        {employee.Gender}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${
                            employee.IsAdmin
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {employee.IsAdmin ? "Admin" : "Employee"}
                        </span>
                      </td>
                      {/* Action Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3 pr-8">
                          {/* View Details Button */}
                          <button
                            className="p-2 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors duration-150 group flex items-center justify-center"
                            title="View Details"
                            onClick={() => handleViewDetails(employee)}
                          >
                            <FaEye className="text-blue-600 group-hover:text-blue-800 text-xl" />
                          </button>

                          {/* Edit Button */}
                          <button
                            className="p-2 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors duration-150 group flex items-center justify-center"
                            title="Edit"
                            onClick={() => handleEdit(employee)}
                          >
                            <CiEdit className="text-green-600 group-hover:text-green-800 text-xl" />
                          </button>

                          {/* Delete Button */}
                          <button
                            className="p-2 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors duration-150 group flex items-center justify-center"
                            title="Delete"
                            onClick={() => handleDelete(employee.id)}
                          >
                            <MdDeleteOutline className="text-red-600 group-hover:text-red-800 text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-gray-500 text-sm"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <MdSearch className="w-16 h-16 text-gray-300" />
                        <div>
                          <p className="font-medium text-lg">
                            No employees found
                          </p>
                          <p className="text-gray-400 mt-1">
                            {searchTerm
                              ? `No results for "${searchTerm}". Try a different search term.`
                              : "No employees match your filters. Try changing them."}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedAndFilteredEmployees.length > 0 && (
            <>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-start items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          if (totalPages <= 7) return true;
                          return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          );
                        })
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded text-sm transition-colors duration-150 ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-cyan-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add New Employee
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Basic Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newEmployee.Name}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, Name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter employee name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newEmployee.Email}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          Email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newEmployee.PhoneNumber}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          PhoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={newEmployee.Gender}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            Gender: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Is Admin
                      </label>
                      <select
                        value={newEmployee.IsAdmin}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            IsAdmin: e.target.value === "true",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      >
                        <option value="false">Employee</option>
                        <option value="true">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Professional Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newEmployee.departmentName}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          departmentName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <select
                      value={newEmployee.jobTitle}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          jobTitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      {jobTitles.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <input
                      type="text"
                      value={newEmployee.salary}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          salary: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter salary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      With Salary
                    </label>
                    <select
                      value={newEmployee.WithSalary}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          WithSalary: e.target.value === "true",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Account Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newEmployee.UserName}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          UserName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newEmployee.Password}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          Password: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Additional Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Achievement
                    </label>
                    <input
                      type="text"
                      value={newEmployee.academicAchievement}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          academicAchievement: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="e.g., Bachelor's in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={newEmployee.address}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Working Hours
                      </label>
                      <input
                        type="time"
                        value={newEmployee.startWorkingHours}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            startWorkingHours: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Working Hours
                      </label>
                      <input
                        type="time"
                        value={newEmployee.endWorkingHours}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            endWorkingHours: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workshift
                    </label>
                    <select
                      value={newEmployee.workshift}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          workshift: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-400 rounded-lg transition-all duration-150 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                <MdCancel className="text-lg" />
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center gap-2"
              >
                <MdAdd />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Details Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-cyan-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Employee Details
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete information based on database schema
                  </p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Employee Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-white">
                    {selectedEmployee.Name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">
                    {selectedEmployee.Name}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg text-gray-700 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">
                      {selectedEmployee.jobTitle}
                    </span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        selectedEmployee.IsAdmin
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-blue-600 text-white shadow-sm"
                      }`}
                    >
                      {selectedEmployee.IsAdmin ? "Admin" : "Employee"}
                    </span>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                      Dept: {selectedEmployee.departmentName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Layout for Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-blue-50 rounded-xl p-5 shadow-sm border border-blue-100">
                  <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center gap-2">
                    <MdPerson className="text-blue-500" />
                    Personal Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <label className="text-sm text-gray-600">Gender</label>
                      <p className="font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        {selectedEmployee.Gender}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <label className="text-sm text-gray-600">Address</label>
                      <p className="font-medium text-blue-700 text-right">
                        {selectedEmployee.address}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <label className="text-sm text-gray-600">
                        Academic Achievement
                      </label>
                      <p className="font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        {selectedEmployee.academicAchievement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100">
                  <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center gap-2">
                    <MdEmail className="text-green-500" />
                    Contact Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-green-100">
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium text-green-700">
                        {selectedEmployee.Email}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <label className="text-sm text-gray-600">
                        Phone Number
                      </label>
                      <p className="font-medium text-green-700">
                        {selectedEmployee.PhoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="bg-purple-50 rounded-xl p-5 shadow-sm border border-purple-100">
                  <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-purple-200 flex items-center gap-2">
                    <MdWork className="text-purple-500" />
                    Employment Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <label className="text-sm text-gray-600">
                        Department
                      </label>
                      <p className="font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                        {selectedEmployee.departmentName}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <label className="text-sm text-gray-600">Job Title</label>
                      <p className="font-medium text-purple-700">
                        {selectedEmployee.jobTitle}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <label className="text-sm text-gray-600">
                        With Salary
                      </label>
                      <p
                        className={`font-medium px-3 py-1 rounded-full ${
                          selectedEmployee.WithSalary
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedEmployee.WithSalary ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Work Schedule */}
                <div className="bg-amber-50 rounded-xl p-5 shadow-sm border border-amber-100">
                  <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-amber-200 flex items-center gap-2">
                    <MdAccessTime className="text-amber-500" />
                    Work Schedule
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <label className="text-sm text-gray-600">
                        Start Time
                      </label>
                      <p className="font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                        {selectedEmployee.startWorkingHours}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <label className="text-sm text-gray-600">End Time</label>
                      <p className="font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                        {selectedEmployee.endWorkingHours}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <label className="text-sm text-gray-600">Workshift</label>
                      <p className="font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                        {selectedEmployee.workshift}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-emerald-50 rounded-xl p-5 shadow-sm border border-emerald-100">
                  <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-emerald-200 flex items-center gap-2">
                    <MdAccountBalance className="text-emerald-500" />
                    Financial Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <label className="text-sm text-gray-600">
                        Monthly Salary
                      </label>
                      <p className="font-bold text-xl text-green-600 bg-white px-3 py-1 rounded-full shadow-sm">
                        {selectedEmployee.salary}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <label className="text-sm text-gray-600">
                        Employment Type
                      </label>
                      <p className="font-medium text-emerald-700 bg-white px-3 py-1 rounded-full">
                        {selectedEmployee.IsAdmin
                          ? "Administrative"
                          : "Regular Employee"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-indigo-50 rounded-xl p-5 shadow-sm border border-indigo-100">
                  <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-indigo-200 flex items-center gap-2">
                    <MdLock className="text-indigo-500" />
                    Account Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                      <label className="text-sm text-gray-600">Username</label>
                      <p className="font-medium text-indigo-700">
                        {selectedEmployee.UserName}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                      <label className="text-sm text-gray-600">Password</label>
                      <p className="font-medium text-indigo-700">
                        {selectedEmployee.Password}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <label className="text-sm text-gray-600">
                        Created At
                      </label>
                      <p className="font-medium text-indigo-700">
                        {selectedEmployee.CreatedAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                  <MdSchool className="inline mr-2 text-gray-600" />
                  Skills & Expertise
                </h5>
                <div className="flex flex-wrap gap-3">
                  {selectedEmployee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 shadow-sm border border-blue-100">
                <h5 className="font-semibold text-gray-800 mb-3">
                  Employee Summary
                </h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedEmployee.Name} ({selectedEmployee.UserName}) is a{" "}
                  {selectedEmployee.Gender.toLowerCase()}{" "}
                  <span className="font-medium text-blue-600">
                    {selectedEmployee.jobTitle.toLowerCase()}
                  </span>{" "}
                  in the{" "}
                  <span className="font-medium text-purple-600">
                    {selectedEmployee.departmentName}
                  </span>{" "}
                  department.
                  {selectedEmployee.IsAdmin
                    ? " Has administrative privileges with"
                    : " Has"}{" "}
                  a salary of{" "}
                  <span className="font-bold text-green-600">
                    {selectedEmployee.salary}
                  </span>{" "}
                  and works{" "}
                  <span className="font-medium text-amber-600">
                    {selectedEmployee.workshift} shift
                  </span>{" "}
                  from {selectedEmployee.startWorkingHours} to{" "}
                  {selectedEmployee.endWorkingHours}.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Updated: {selectedEmployee.UpdatedAt} | Created:{" "}
                {selectedEmployee.CreatedAt}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-400 rounded-lg transition-all duration-150 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  <MdCancel className="text-lg" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-cyan-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Edit Employee
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Update information for {editingEmployee.Name}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2 border-green-200">
                    Basic Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.Name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          Name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter employee name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={editFormData.Email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          Email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.PhoneNumber}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          PhoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={editFormData.Gender}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            Gender: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Is Admin
                      </label>
                      <select
                        value={editFormData.IsAdmin}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            IsAdmin: e.target.value === "true",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      >
                        <option value="false">Employee</option>
                        <option value="true">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2 border-blue-200">
                    Professional Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={editFormData.departmentName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          departmentName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <select
                      value={editFormData.jobTitle}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          jobTitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                    >
                      {jobTitles.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <input
                      type="text"
                      value={editFormData.salary}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          salary: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter salary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      With Salary
                    </label>
                    <select
                      value={editFormData.WithSalary}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          WithSalary: e.target.value === "true",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2 border-purple-200">
                    Account Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.UserName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          UserName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={editFormData.Password}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          Password: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2 border-amber-200">
                    Additional Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Achievement
                    </label>
                    <input
                      type="text"
                      value={editFormData.academicAchievement}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          academicAchievement: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Academic achievement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      placeholder="Enter address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Working Hours
                      </label>
                      <input
                        type="time"
                        value={editFormData.startWorkingHours}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            startWorkingHours: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Working Hours
                      </label>
                      <input
                        type="time"
                        value={editFormData.endWorkingHours}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            endWorkingHours: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workshift
                    </label>
                    <select
                      value={editFormData.workshift}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          workshift: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Editing:{" "}
                <span className="font-medium">{editingEmployee.Name}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-400 rounded-lg transition-all duration-150 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  <MdCancel className="text-lg" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <MdSave />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
