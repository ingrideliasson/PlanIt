import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { setAuthToken } from "../services/api";
import Header from "./Header";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";





export default function BoardView({onLogout}) {
  const { id } = useParams(); // id will be a string
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add-list UI state
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addListLoading, setAddListLoading] = useState(false);

  // Add-task state: map listId -> current input value
  const [newTaskTitles, setNewTaskTitles] = useState({});
  const [addTaskLoading, setAddTaskLoading] = useState({});

  useEffect(() => {
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchBoard() {
    setLoading(true);
    try {
      const res = await api.get(`/userboards/${id}/details`);
      setBoard(res.data);
    } catch (err) {
      console.error("Failed to load board:", err);
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }

  // --- Add list ---
  function startAddList() {
    setAddingList(true);
    setTimeout(() => {
      // small timeout so autofocus works if you choose to add autoFocus attribute
      const el = document.getElementById("new-list-input");
      if (el) el.focus();
    }, 50);
  }

  function cancelAddList() {
    setAddingList(false);
    setNewListTitle("");
  }

  async function submitAddList(e) {
    e.preventDefault();
    const title = (newListTitle || "").trim();
    if (!title) return;
    setAddListLoading(true);
    try {
      // backend expects { title, userBoardId }
      await api.post("/tasklists", { title, userBoardId: board.id });
      setNewListTitle("");
      setAddingList(false);
      await fetchBoard();
    } catch (err) {
      console.error("Failed to add list:", err);
      // optional: show UI error toast
    } finally {
      setAddListLoading(false);
    }
  }

  // Edit list title
  async function handleEditList(list) {
  const newTitle = prompt("Enter new title", list.title);
  if (!newTitle) return;

  try {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    await api.put(`/tasklists/${list.id}`, { Title: newTitle });
    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(l =>
        l.id === list.id ? { ...l, title: newTitle} : l
      ),
    }));
  } catch (error) {
    console.error("Error updating list:", error);
    alert("Failed to update list.");
  }
}

  // Delete list
  async function handleDeleteList(list) {
    if (!window.confirm("Are you sure you want to delete this list?")) return;

    try {
      await api.delete(`/tasklists/${list.id}`);
      setBoard(prev => ({
        ...prev, 
        taskLists: prev.taskLists.filter(l => l.id !== list.id)
      }));
    } catch (error) {
      console.error("Error deleting list", error);
      alert("Failed to delete list.")
    }
  }

  // --- Add task ---
  function setTaskTitle(listId, value) {
    setNewTaskTitles(prev => ({ ...prev, [listId]: value }));
  }

  async function submitAddTask(e, listId) {
    e.preventDefault();
    const title = (newTaskTitles[listId] || "").trim();
    if (!title) return;
    setAddTaskLoading(prev => ({ ...prev, [listId]: true }));
    try {
      // backend expects { title, taskListId }
      await api.post("/taskitems", { title, taskListId: listId });
      setNewTaskTitles(prev => ({ ...prev, [listId]: "" }));
      await fetchBoard();
    } catch (err) {
      console.error("Failed to add task:", err);
      // optional: show UI error toast
    } finally {
      setAddTaskLoading(prev => ({ ...prev, [listId]: false }));
    }
  }

  // Edit task
async function handleEditTask(list, task) {
  const newTitle = prompt("Enter a new title: ", task.title);
  if (!newTitle) return;

  try {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    await api.put(`/taskitems/${task.id}`, { Title: newTitle });

    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(l =>
        l.id === list.id
          ? {
              ...l,
              taskItems: l.taskItems.map(t =>
                t.id === task.id ? { ...t, title: newTitle } : t
              ),
            }
          : l
      ),
    }));
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task.");
  }
}

// Delete task
async function handleDeleteTask(list, task) {
  if (!window.confirm("Are you sure you want to delete this task?")) return;

  try {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    await api.delete(`/taskitems/${task.id}`);

    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(l =>
        l.id === list.id
          ? {
              ...l,
              taskItems: l.taskItems.filter(t =>
                t.id !== task.id
              ),
            }
          : l
      ),
    }));
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task.");
  }
}


  if (loading) return <div className="p-6">Loading...</div>;
  if (!board) return <div className="p-6">Board not found</div>;

return (
  <div className="min-h-screen flex flex-col bg-gradient-to-tr from-fuchsia-800 via-pink-800 to-yellow-400 font-montserrat">
    <Header onLogout={onLogout} />
    <div className="flex flex-col flex-1 min-h-0">
      <h1 className="text-white text-2xl font-montserrat pl-8 py-8 px-6">{board.title}</h1>
      {/* Horizontal scroll wrapper */}
      <div className="flex-1 px-6 pb-6 overflow-x-auto board-scroll" style={{ minHeight: 1 }}>
        <div className="flex gap-6 min-w-max items-start">
          {board.taskLists.map(list => (
            <div
              key={list.id}
              className="bg-orange-400 rounded-2xl p-4 flex-shrink-0 w-64 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-amber-950 text-sm ml-2">{list.title}</h2>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="text-amber-950 hover:text-xl text-lg"
                    title="Edit list"
                    onClick={() => handleEditList(list)}
                  >
                    <CiEdit />
                  </button>
                  <button
                    type="button"
                    className="text-amber-950 hover:text-xl text-lg"
                    title="Delete list"
                    onClick={() => handleDeleteList(list)}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
              <ul className="space-y-2 mb-3">
                {list.taskItems.map(task => (
                  <li
                    key={task.id}
                    className="bg-white text-gray-600 text-left font-opensans py-4 rounded-lg text-sm flex items-center justify-between px-3"
                  >
                    <span>{task.title}</span>
                    <span className="flex gap-1 ml-2">
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-800 text-lg"
                        title="Edit task"
                        onClick={() => handleEditTask(list, task)}
                      >
                        <CiEdit />
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 text-lg"
                        title="Delete task"
                        onClick={() => handleDeleteTask(list, task)}
                      >
                        <MdDeleteOutline />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              {/* Add task form */}
              <form onSubmit={(e) => submitAddTask(e, list.id)}>
                <input
                  type="text"
                  value={newTaskTitles[list.id] || ""}
                  onChange={(e) => setTaskTitle(list.id, e.target.value)}
                  placeholder="Add new task..."
                  className="w-full rounded-lg px-3 py-2 text-sm mb-2 bg-transparent text-orange-500 hover:bg-orange-600"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={addTaskLoading[list.id]}
                    className="px-3 py-1 rounded-lg bg-white text-black text-sm"
                  >
                    {addTaskLoading[list.id] ? "Adding…" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskTitle(list.id, "")}
                    className="py-1 bg-transparent text-amber-950 text-xl"
                  >
                    <RxCross1 />
                  </button>
                </div>
              </form>
            </div>
          ))}

          {/* Add new list card */}
          <div className="bg-orange-400 text-amber-950 font-montserrat rounded-lg text-sm p-4 flex-shrink-0 w-64 flex flex-col justify-center">
            {addingList ? (
              <form
                id="add-list-form"
                onSubmit={submitAddList}
                className="flex flex-col"
              >
                <input
                  id="new-list-input"
                  autoFocus
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="List title..."
                  className="bg-transparent text-center w-full border-b border-white/30 pb-2 mb-3 focus:outline-none"
                />
                <div className="flex gap-2 justify-center">
                  <button
                    type="submit"
                    disabled={addListLoading}
                    className="px-3 py-1 rounded-lg text-amber-950"
                  >
                    {addListLoading ? "Adding…" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelAddList}
                    className="px-3 py-1 rounded-full bg-purple-600 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <button
                  onClick={startAddList}
                  className="text-white/90 hover:text-white"
                >
                  + Add List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
