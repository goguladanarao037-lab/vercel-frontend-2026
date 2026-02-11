//React-App.js//
import { useEffect, useState } from "react";
import axios from "axios";
import { validateUserForm } from "./validation";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: ""
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:4500/users");
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateUserForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    editId
      ? await axios.put(`http://localhost:4500/users/${editId}`, form)
      : await axios.post("http://localhost:4500/users", form);

    setForm({ first_name: "", last_name: "", phone: "", email: "" });
    setEditId(null);
    setErrors({});
    fetchUsers();
  };

  const handleEdit = ({ id, first_name, last_name, phone, email }) => {
    setForm({ first_name, last_name, phone, email });
    setEditId(id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4500/users/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
        />
        {errors.first_name && <p>{errors.first_name}</p>}

        <input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
        />
        {errors.last_name && <p>{errors.last_name}</p>}

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />
        {errors.phone && <p>{errors.phone}</p>}

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && <p>{errors.email}</p>}

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <h2>User List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.first_name}</td>
              <td>{u.last_name}</td>
              <td>{u.phone}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
