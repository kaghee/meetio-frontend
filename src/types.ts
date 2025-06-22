export interface Employee {
  id: number;
  name: string;
  email: string;
  position: "manager" | "employee";
  department: number;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
  employees: Employee[];
}
