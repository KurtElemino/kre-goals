// app/Home.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../core/AuthContext";

// Simulated cloud storage (replace with real API in production)
const CLOUD_KEY = "notery_tasks";

const priorities = ["High", "Normal", "Low"];
const categories = ["Work", "Personal", "Other"];

function sortTasks(tasks, sortBy) {
  if (sortBy === "dueDate") {
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
  if (sortBy === "priority") {
    const order = { High: 1, Normal: 2, Low: 3 };
    return [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
  }
  if (sortBy === "category") {
    return [...tasks].sort((a, b) => (a.category || "").localeCompare(b.category || ""));
  }
  return tasks;
}

export default function Home() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [category, setCategory] = useState("Personal");
  const [notes, setNotes] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  // Load tasks from "cloud" (localStorage or API)
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const raw = await Promise.resolve(localStorage.getItem(CLOUD_KEY));
        if (raw) setTasks(JSON.parse(raw));
      } catch {}
    };
    loadTasks();
  }, []);

  // Save tasks to "cloud"
  useEffect(() => {
    Promise.resolve(localStorage.setItem(CLOUD_KEY, JSON.stringify(tasks)));
  }, [tasks]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/Login");
    } catch (error) {
      alert(error.message);
    }
  };

  const openAddModal = () => {
    setEditTaskId(null);
    setTitle("");
    setDueDate("");
    setPriority("Normal");
    setCategory("Personal");
    setNotes("");
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setCategory(task.category);
    setNotes(task.notes);
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!title || !dueDate) {
      Alert.alert("Title and Due Date are required.");
      return;
    }
    if (editTaskId) {
      setTasks(tasks =>
        tasks.map(t =>
          t.id === editTaskId
            ? { ...t, title, dueDate, priority, category, notes }
            : t
        )
      );
    } else {
      setTasks(tasks => [
        ...tasks,
        {
          id: Date.now().toString(),
          title,
          dueDate,
          priority,
          category,
          notes,
        },
      ]);
    }
    setModalVisible(false);
  };

  const handleDeleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTasks(tasks => tasks.filter(t => t.id !== id)),
      },
    ]);
  };

  const sortedTasks = sortTasks(tasks, sortBy);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Notery</Text>
        <Text style={styles.subtitle}>
          {user?.email ? `Hello, ${user.email}` : "Stay organized with your tasks"}
        </Text>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {["dueDate", "priority", "category"].map(key => (
            <TouchableOpacity
              key={key}
              style={[
                styles.sortButton,
                sortBy === key && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(key)}
            >
              <Text style={styles.sortButtonText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={sortedTasks}
          keyExtractor={item => item.id}
          style={{ width: "100%", marginVertical: 10 }}
          ListEmptyComponent={
            <Text style={{ color: "#888", textAlign: "center", margin: 20 }}>
              No tasks yet. Add one!
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskMeta}>
                  Due: {item.dueDate} | Priority: {item.priority} | Category: {item.category}
                </Text>
                {item.notes ? (
                  <Text style={styles.taskNotes}>Notes: {item.notes}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                <Text style={{ color: "#007bff" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Text style={{ color: "#dc3545" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Add/Edit Task */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editTaskId ? "Edit Task" : "Add Task"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={setDueDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.row}>
              <Text style={styles.label}>Priority:</Text>
              {priorities.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.chip,
                    priority === p && styles.chipActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={priority === p ? styles.chipTextActive : styles.chipText}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Category:</Text>
              {categories.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.chip,
                    category === c && styles.chipActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={category === c ? styles.chipTextActive : styles.chipText}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveTask}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#dc3545",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
    justifyContent: "center",
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 8,
    color: "#333",
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#eee",
    marginHorizontal: 2,
  },
  sortButtonActive: {
    backgroundColor: "#007bff",
  },
  sortButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f1f3f4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: "100%",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  taskMeta: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  taskNotes: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  editBtn: {
    marginLeft: 10,
    padding: 4,
  },
  deleteBtn: {
    marginLeft: 4,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 350,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fafbfc",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginRight: 8,
    color: "#333",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#eee",
    marginHorizontal: 2,
  },
  chipActive: {
    backgroundColor: "#007bff",
  },
  chipText: {
    color: "#333",
    fontWeight: "bold",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  cancelBtnText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
});
