import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const STORAGE_KEY = "user_data";

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
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (stored.user) {
      setUser(stored.user);
      setTasks(stored.tasks || []);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, tasks }));
    }
  }, [tasks, user]);

  const handleLogin = () => {
    if (email && password) {
      setUser({ email });
    }
  };

  const handleRegister = () => {
    if (email && password) {
      setUser({ email });
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold text-center pt-4">{view === "login" ? "Login" : "Register"}</h2>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={view === "login" ? handleLogin : handleRegister} className="w-full">
              {view === "login" ? "Login" : "Register"}
            </Button>
            <p className="text-sm text-center">
              {view === "login" ? (
                <span>
                  Belum punya akun? <button className="text-blue-500" onClick={() => setView("register")}>Daftar</button>
                </span>
              ) : (
                <span>
                  Sudah punya akun? <button className="text-blue-500" onClick={() => setView("login")}>Login</button>
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={() => { setUser(null); setTasks([]); localStorage.removeItem(STORAGE_KEY); }}>Logout</Button>
      </div>

      <div className="space-y-2 mb-4">
        <Input placeholder="Nama Garapan" value={newTask.nama} onChange={(e) => setNewTask({ ...newTask, nama: e.target.value })} />
        <Input placeholder="Banyak Akun" value={newTask.akun} onChange={(e) => setNewTask({ ...newTask, akun: e.target.value })} />
        <Input placeholder="Task" value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} />
        <Input placeholder="Link" value={newTask.link} onChange={(e) => setNewTask({ ...newTask, link: e.target.value })} />
        <Button onClick={handleAddOrUpdateTask}>{editIndex !== null ? "Update Garapan" : "Tambah Garapan"}</Button>
      </div>

      <div className="mb-4">
        <Input placeholder="Cari garapan..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nama Garapan</th>
              <th className="border px-4 py-2">Banyak Akun</th>
              <th className="border px-4 py-2">Task</th>
              <th className="border px-4 py-2">Link</th>
              <th className="border px-4 py-2">Sudah/Belum</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{t.nama}</td>
                <td className="border px-4 py-2">{t.akun}</td>
                <td className="border px-4 py-2">{t.task}</td>
                <td className="border px-4 py-2">
                  <a href={t.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border px-4 py-2 text-center">
                  <Checkbox checked={t.sudah} onCheckedChange={() => toggleCheckbox(tasks.indexOf(t))} />
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(tasks.indexOf(t))}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tasks.indexOf(t))}>Hapus</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
