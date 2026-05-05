import { useEffect, useState } from "react";
import { Save, Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
  getSuperAdminUsers,
  updateSuperAdminUser,
} from "../services/superAdminPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const data = await getSuperAdminUsers({ search, role });
      setUsers(data.users || []);
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserField = (id, field, value) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === id ? { ...user, [field]: value } : user))
    );
  };

  const saveUser = async (user) => {
    try {
      await updateSuperAdminUser(user._id, {
        role: user.role,
        isActive: user.isActive,
        trustScore: user.trustScore,
      });

      toast.success("User updated");
    } catch (error) {
      toast.error(error.message || "User update failed");
    }
  };

  if (loading) return <Loader text="Loading users..." />;

  return (
    <main className="admin-panel-page">
      <section className="admin-panel-header">
        <div>
          <span>Super Admin</span>
          <h1>Manage Users</h1>
          <p>Activate, deactivate, and change roles of users.</p>
        </div>
      </section>

      <section className="admin-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search name, email, phone, city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="department_officer">Department Officer</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <button className="primary-btn" onClick={fetchUsers}>
          <Users size={18} />
          Load Users
        </button>
      </section>

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <section className="admin-table-card">
          <div className="table-title">
            <Users size={20} />
            <h2>{users.length} Users</h2>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Trust</th>
                  <th>Active</th>
                  <th>Save</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(event) =>
                          updateUserField(user._id, "role", event.target.value)
                        }
                      >
                        <option value="citizen">Citizen</option>
                        <option value="department_officer">Department Officer</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={user.trustScore || 50}
                        onChange={(event) =>
                          updateUserField(user._id, "trustScore", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={String(user.isActive)}
                        onChange={(event) =>
                          updateUserField(
                            user._id,
                            "isActive",
                            event.target.value === "true"
                          )
                        }
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="table-save-btn"
                        onClick={() => saveUser(user)}
                      >
                        <Save size={16} />
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default ManageUsers;