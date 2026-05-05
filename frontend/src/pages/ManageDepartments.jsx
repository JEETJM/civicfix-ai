import { useEffect, useState } from "react";
import { Building2, Plus, Save } from "lucide-react";
import toast from "react-hot-toast";
import {
  createSuperAdminDepartment,
  getSuperAdminDepartments,
  updateSuperAdminDepartment,
} from "../services/superAdminPanelService";
import Loader from "../components/Loader";

const emptyDepartment = {
  name: "",
  category: "",
  officerName: "",
  email: "",
  phone: "",
  description: "",
};

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState(emptyDepartment);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    setLoading(true);

    try {
      const data = await getSuperAdminDepartments();
      setDepartments(data.departments || []);
    } catch (error) {
      toast.error(error.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const updateDepartmentField = (id, field, value) => {
    setDepartments((prev) =>
      prev.map((department) =>
        department._id === id ? { ...department, [field]: value } : department
      )
    );
  };

  const handleNewChange = (event) => {
    setNewDepartment((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createDepartment = async (event) => {
    event.preventDefault();

    try {
      await createSuperAdminDepartment(newDepartment);
      toast.success("Department created");
      setNewDepartment(emptyDepartment);
      fetchDepartments();
    } catch (error) {
      toast.error(error.message || "Create failed");
    }
  };

  const saveDepartment = async (department) => {
    try {
      await updateSuperAdminDepartment(department._id, department);
      toast.success("Department updated");
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  if (loading) return <Loader text="Loading departments..." />;

  return (
    <main className="admin-panel-page">
      <section className="admin-panel-header">
        <div>
          <span>Super Admin</span>
          <h1>Manage Departments</h1>
          <p>Create and update civic departments and officers.</p>
        </div>
      </section>

      <section className="admin-card">
        <h2>Create New Department</h2>

        <form className="department-create-form" onSubmit={createDepartment}>
          <input
            name="name"
            placeholder="Department name"
            value={newDepartment.name}
            onChange={handleNewChange}
            required
          />

          <input
            name="category"
            placeholder="Category e.g. road"
            value={newDepartment.category}
            onChange={handleNewChange}
            required
          />

          <input
            name="officerName"
            placeholder="Officer name"
            value={newDepartment.officerName}
            onChange={handleNewChange}
          />

          <input
            name="email"
            placeholder="Officer email"
            value={newDepartment.email}
            onChange={handleNewChange}
          />

          <input
            name="phone"
            placeholder="Officer phone"
            value={newDepartment.phone}
            onChange={handleNewChange}
          />

          <input
            name="description"
            placeholder="Description"
            value={newDepartment.description}
            onChange={handleNewChange}
          />

          <button className="primary-btn">
            <Plus size={18} />
            Create Department
          </button>
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-title">
          <Building2 size={20} />
          <h2>{departments.length} Departments</h2>
        </div>

        <div className="department-grid">
          {departments.map((department) => (
            <div className="department-edit-card" key={department._id}>
              <label>
                Name
                <input
                  value={department.name || ""}
                  onChange={(event) =>
                    updateDepartmentField(department._id, "name", event.target.value)
                  }
                />
              </label>

              <label>
                Category
                <input
                  value={department.category || ""}
                  onChange={(event) =>
                    updateDepartmentField(
                      department._id,
                      "category",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Officer
                <input
                  value={department.officerName || ""}
                  onChange={(event) =>
                    updateDepartmentField(
                      department._id,
                      "officerName",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Email
                <input
                  value={department.email || ""}
                  onChange={(event) =>
                    updateDepartmentField(department._id, "email", event.target.value)
                  }
                />
              </label>

              <label>
                Phone
                <input
                  value={department.phone || ""}
                  onChange={(event) =>
                    updateDepartmentField(department._id, "phone", event.target.value)
                  }
                />
              </label>

              <button
                className="table-save-btn"
                onClick={() => saveDepartment(department)}
              >
                <Save size={16} />
                Save Department
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ManageDepartments;