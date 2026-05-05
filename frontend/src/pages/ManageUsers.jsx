import { useEffect, useState } from "react";
import { CheckCircle2, Save, Search, ShieldAlert, Users, XCircle } from "lucide-react";
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
        trustScore: user.role === "citizen" ? user.trustScore : undefined,
        approvalStatus: user.approvalStatus,
      });

      toast.success("User updated");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "User update failed");
    }
  };

  const approveAdmin = async (user) => {
    try {
      await updateSuperAdminUser(user._id, {
        approvalStatus: "Approved",
        isActive: true,
      });

      toast.success("Admin approved successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Approval failed");
    }
  };

  const rejectAdmin = async (user) => {
    try {
      await updateSuperAdminUser(user._id, {
        approvalStatus: "Rejected",
        isActive: false,
      });

      toast.success("Admin request rejected");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Reject failed");
    }
  };

  if (loading) return <Loader text="Loading users..." />;

  const pendingAdmins = users.filter(
    (user) => user.role === "admin" && user.approvalStatus === "Pending"
  );

  return (
    <main className="admin-panel-page">
      <section className="admin-panel-header">
        <div>
          <span>Super Admin</span>
          <h1>Manage Users</h1>
          <p>Approve admin requests, activate users, and manage roles.</p>
        </div>
      </section>

      {pendingAdmins.length > 0 && (
        <section className="admin-table-card approval-request-card">
          <div className="table-title">
            <ShieldAlert size={20} />
            <h2>{pendingAdmins.length} Pending Admin Requests</h2>
          </div>

          <div className="approval-grid">
            {pendingAdmins.map((user) => (
              <div className="approval-card" key={user._id}>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <small>{user.city || "No city added"}</small>
                </div>

                <div className="approval-actions">
                  <button
                    className="approve-btn"
                    onClick={() => approveAdmin(user)}
                  >
                    <CheckCircle2 size={17} />
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rejectAdmin(user)}
                  >
                    <XCircle size={17} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  <th>Approval</th>
                  <th>Citizen Trust</th>
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
                      {user.role === "admin" ? (
                        <select
                          value={user.approvalStatus || "Pending"}
                          onChange={(event) =>
                            updateUserField(
                              user._id,
                              "approvalStatus",
                              event.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        <span className="approval-pill approved-pill">
                          Approved
                        </span>
                      )}
                    </td>

                    <td>
                      {user.role === "citizen" ? (
                        <input
                          type="number"
                          value={user.trustScore || 50}
                          onChange={(event) =>
                            updateUserField(
                              user._id,
                              "trustScore",
                              event.target.value
                            )
                          }
                        />
                      ) : (
                        <span className="muted-cell">Not applicable</span>
                      )}
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