import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./App.css";

// ------------------- DEPLOYED BACKEND URL -------------------
const API_URL = "https://backend-nine-sigma-53.vercel.app";

// ------------------- FORM SCHEMA -------------------
const formSchema = [
  { name: "first_name", label: "First Name", type: "text", required: true },
  { name: "last_name", label: "Last Name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "dob", label: "Date of Birth", type: "date", required: false },
  { name: "address", label: "Address", type: "text", required: false },
];

// ------------------- FORM VALIDATION -------------------
const validateUserForm = (form) => {
  const errors = {};
  formSchema.forEach((f) => {
    if (f.required && (!form[f.name] || form[f.name].trim() === "")) {
      errors[f.name] = "This field is required";
    }
  });
  return errors;
};

// ------------------- FORMAT DOB -------------------
const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// ------------------- GITHUB LOGIN -------------------
const clientId = "Ov23liVUqCm7JakOgwlR";
const redirectUri = `${API_URL}/api/auth/callback`;

function loginWithGitHub() {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
}

// ------------------- USER FORM -------------------
function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialForm = {};
  formSchema.forEach((f) => (initialForm[f.name] = ""));

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Fetch existing user if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/users/${id}`)
        .then((res) => {
          const user = res.data;
          if (user.dob) user.dob = user.dob.split("T")[0];
          setForm(user);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateUserForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      if (id) {
        await axios.put(`${API_URL}/users/${id}`, form);
      } else {
        await axios.post(`${API_URL}/users`, form);
      }
      setForm(initialForm);
      setErrors({});
      navigate("/users");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="form-container">
      <button onClick={loginWithGitHub} className="form-button" style={{ marginBottom: "20px" }}>
        Login with GitHub
      </button>

      <h2>{id ? "Edit User" : "User Form"}</h2>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <tbody>
            {formSchema.map((field) => (
              <tr key={field.name}>
                <td>
                  <label>{field.label}</label>
                </td>
                <td>
                  <input
                    type={field.type}
                    placeholder={field.label}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="form-input"
                  />
                  {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="form-button">Submit</button>
        <button type="button" className="form-button" onClick={handleReset}>Reset</button>
      </form>
    </div>
  );
}

// ------------------- USER LIST -------------------
function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/users`);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => navigate(`/edit/${id}`);

  return (
    <div className="form-container">
      <h2>User List</h2>
      {users.length > 0 ? (
        <div className="user-list-wrapper">
          <table className="user-list-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.dob)}</td>
                  <td>{user.address}</td>
                  <td>
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(user.id)}>
                      <FaEdit />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(user.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

// ------------------- MAIN APP -------------------
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/edit/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;
