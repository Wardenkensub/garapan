import React, { useState, useEffect } from "react";

const getStorageKey = (email) => "user_data_" + email;

export default function App() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ nama: "", akun: "", task: "", link: "", sudah: false });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("user_data_")) {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.user) {
          setUser(data.user);
          setTasks(data.tasks || []);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      const key = getStorageKey(user.email);
      localStorage.setItem(key, JSON.stringify({ user, tasks }));
    }
  }, [tasks, user]);

  const handleLogin = () => {
    if (email && password) {
      const stored = JSON.parse(localStorage.getItem(getStorageKey(email)) || "{}");
      setUser({ email });
      setTasks(stored.tasks || []);
    }
  };

  const handleRegister = () => {
    if (email && password) {
      setUser({ email });
      setTasks([]);
    }
  };

  const handleAddOrUpdateTask = () => {
    if (newTask.nama && newTask.akun && newTask.task && newTask.link) {
      if (editIndex !== null) {
        const updated = [...tasks];
        updated[editIndex] = newTask;
        setTasks(updated);
        setEditIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setNewTask({ nama: "", akun: "", task: "", link: "", sudah: false });
    }
  };

  const toggleCheckbox = (index) => {
    const updated = [...tasks];
    updated[index].sudah = !updated[index].sudah;
    setTasks(updated);
  };

  const handleEdit = (index) => {
    setNewTask(tasks[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const filteredTasks = tasks.filter(t =>
    t.nama.toLowerCase().includes(search.toLowerCase()) ||
    t.akun.toLowerCase().includes(search.toLowerCase()) ||
    t.task.toLowerCase().includes(search.toLowerCase()) ||
    t.link.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div style={{ ...styles.centered, padding: 20 }}>
        <div style={styles.loginCard}>
          <h2 style={{ marginBottom: 15 }}>{view === "login" ? "Login" : "Register"}</h2>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
          <button onClick={view === "login" ? handleLogin : handleRegister} style={styles.button}>
            {view === "login" ? "Login" : "Register"}
          </button>
          <p style={{ marginTop: 10 }}>
            {view === "login" ? (
              <>Belum punya akun? <button onClick={() => setView("register")} style={styles.link}>Daftar</button></>
            ) : (
              <>Sudah punya akun? <button onClick={() => setView("login")} style={styles.link}>Login</button></>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={{ fontSize: 24 }}>Dashboard</h1>
        <button
          onClick={() => {
            setUser(null);
          }}
          style={styles.button}
        >
          Logout
        </button>
      </div>

      <div style={styles.form}>
        <input placeholder="Nama Garapan" value={newTask.nama} onChange={(e) => setNewTask({ ...newTask, nama: e.target.value })} style={styles.input} />
        <input placeholder="Banyak Akun" value={newTask.akun} onChange={(e) => setNewTask({ ...newTask, akun: e.target.value })} style={styles.input} />
        <input placeholder="Task" value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} style={styles.input} />
        <input placeholder="Link" value={newTask.link} onChange={(e) => setNewTask({ ...newTask, link: e.target.value })} style={styles.input} />
        <button onClick={handleAddOrUpdateTask} style={styles.button}>
          {editIndex !== null ? "Update Garapan" : "Tambah Garapan"}
        </button>
      </div>

      <input placeholder="Cari garapan..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} />

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thtd}>Nama</th>
              <th style={styles.thtd}>Akun</th>
              <th style={styles.thtd}>Task</th>
              <th style={styles.thtd}>Link</th>
              <th style={styles.thtd}>Sudah</th>
              <th style={styles.thtd}>Aksi</th>
            </tr>
          </thead>
        <tbody>
  {filteredTasks.map((t, i) => (
    <tr key={i}>
      <td data-label="Nama">{t.nama}</td>
      <td data-label="Akun">{t.akun}</td>
      <td data-label="Task">{t.task}</td>
      <td data-label="Link">
        <a href={t.link} target="_blank" rel="noreferrer">Link</a>
      </td>
      <td data-label="Sudah">
        <input type="checkbox" checked={t.sudah} onChange={() => toggleCheckbox(i)} />
      </td>
      <td data-label="Aksi">
        <button onClick={() => handleEdit(i)} style={styles.smallButton}>Edit</button>
        <button onClick={() => handleDelete(i)} style={{ ...styles.smallButton, background: "#f44336" }}>Hapus</button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: 20,
    fontFamily: "Arial, sans-serif",
    maxWidth: 800,
    margin: "0 auto",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    boxSizing: "border-box"
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: 20,
    boxSizing: "border-box"
  },
  loginCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 320
  },
  input: {
    padding: 10,
    marginBottom: 10,
    width: "100%",
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    width: "100%",
    marginBottom: 10,
    boxSizing: "border-box"
  },
  link: {
    background: "none",
    border: "none",
    color: "#2196F3",
    cursor: "pointer",
    textDecoration: "underline"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10
  },
  form: {
    marginBottom: 20
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
    border: "1px solid #ccc"
  },
  smallButton: {
    padding: "5px 10px",
    marginRight: 5,
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  },
  thtd: {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left"
  }
};
