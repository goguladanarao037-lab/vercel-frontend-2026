import { useEffect, useState } from "react";
import axios from "axios";
import { validateUserForm } from "./validation";
import "./App.css";

const formSchema = [
  { name: "first_name", label: "First Name", type: "text", required: true },
  { name: "last_name", label: "Last Name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "dob", label: "Date of Birth", type: "date", required: false },
  { name: "address", label: "Address", type: "text", required: false },
];

function App() {
  const initialForm = {};
  formSchema.forEach((f) => (initialForm[f.name] = ""));
  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:4500/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateUserForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:4500/users/${editId}`, form);
      } else {
        await axios.post("http://localhost:4500/users", form);
      }

      setForm(initialForm);
      setEditId(null);
      setErrors({});
      setIsAdding(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    const editForm = {};
    formSchema.forEach((f) => (editForm[f.name] = user[f.name] || ""));
    setForm(editForm);
    setEditId(user.id);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4500/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = () => {
    setForm(initialForm);
    setEditId(null);
    setErrors({});
    setIsAdding(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Form</h2>

      {!isAdding && (
        <button onClick={handleAddClick} style={{ marginBottom: 10, padding: 8 }}>
          Add New User
        </button>
      )}

      {(isAdding || editId) && (
        <form onSubmit={handleSubmit}>
          {formSchema.map((field) => (
            <div key={field.name} style={{ marginBottom: 10 }}>
              <input
                type={field.type}
                placeholder={field.label}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                required={field.required}
                style={{ padding: 5, width: 300 }}
              />
              {errors[field.name] && <p style={{ color: "red" }}>{errors[field.name]}</p>}
            </div>
          ))}

          <button type="submit" style={{ padding: 8, marginTop: 10 }}>
            {editId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {!isAdding && users.length > 0 && (
        <>
          <h2>User List</h2>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                {formSchema.map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  {formSchema.map((f) => (
                    <td key={f.name}>{u[f.name]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
