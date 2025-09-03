import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { setAuthToken } from "../services/api";
import Header from "./Header";
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

  const [addingTaskForListId, setAddingTaskForListId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Supporting state for delete prompts
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const [editingListId, setEditingListId] = useState(null);
  const [editedListTitle, setEditedListTitle] = useState("");


  function startEditing(task) {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditedTitle("");
  }

  async function saveTaskTitle(listId, taskId) {
    try {
      await api.put(`/taskitems/${taskId}`, { title: editedTitle });
      // Update local state so UI matches backend
      setBoard(prev => ({
        ...prev,  
        taskLists: prev.taskLists.map(list =>
          list.id === listId
            ? {
                ...list,
                taskItems: list.taskItems.map(t =>
                  t.id === taskId ? { ...t, title: editedTitle } : t
                )
              }
            : list
        )
      }));
    } finally {
      cancelEdit();
    }
  }

function startEditingList(list) {
  setEditingListId(list.id);
  setEditedListTitle(list.title);
}

function cancelListEdit() {
  setEditingListId(null);
  setEditedListTitle("");
}

async function saveListTitle(listId) {
  const title = editedListTitle.trim();
  if (!title) return cancelListEdit();
  try {
    await api.put(`/tasklists/${listId}`, { title }); // adjust endpoint if needed
    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(l =>
        l.id === listId ? { ...l, title } : l
      )
    }));
  } catch (err) {
    console.error("Failed to update list title:", err);
  } finally {
    cancelListEdit();
  }
}


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

  setAddingTaskForListId(null);
  setNewTaskTitles(prev => ({ ...prev, [listId]: "" }));
  setAddTaskLoading(prev => ({ ...prev, [listId]: true }));

  try {
    const res = await api.post("/taskitems", { title, taskListId: listId });

    // Update state directly without fetching the whole board
    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(list =>
        list.id === listId
          ? { ...list, taskItems: [...list.taskItems, res.data] }
          : list
      )
    }));
  } catch (err) {
    console.error("Failed to add task:", err);
  } finally {
    setAddTaskLoading(prev => ({ ...prev, [listId]: false }));
  }
}

// Delete task
async function handleDeleteTask(list, task) {
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

async function toggleTaskDone(listId, task) {
  const updatedDone = !task.isCompleted;

  try {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    await api.put(`/taskitems/${task.id}`, {IsCompleted: updatedDone});

    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(l =>
        l.id === listId
          ? {
              ...l,
              taskItems: l.taskItems.map(t =>
                t.id === task.id ? { ...t, isCompleted: updatedDone } : t
              ),
            }
          : l
      ),
    }));
  } catch (error) {
    console.error("Error toggling task:", error);
    alert("Failed to update task.");
  }
}


  if (loading) return <div className="p-6">Loading...</div>;
  if (!board) return <div className="p-6">Board not found</div>;

 return (
  <div className="min-h-screen flex flex-col bg-gradient-to-tr from-fuchsia-800 via-pink-800 to-yellow-400 font-montserrat relative">
    <Header onLogout={onLogout} />
    <div className="flex flex-col flex-1 min-h-0">
      <h1 className="text-white text-2xl font-montserrat pl-8 py-8 px-6">
        {board.title}
      </h1>

      <div className="flex-1 px-6 pb-6 overflow-x-auto board-scroll" style={{ minHeight: 1 }}>
        <div className="flex gap-6 min-w-max items-start">
          {board.taskLists.map(list => (
            <div
              key={list.id}
              className="bg-orange-400 rounded-2xl p-4 flex-shrink-0 w-64 flex flex-col relative"
            >
              <div className="flex items-center justify-between mb-3">
                {editingListId === list.id ? (
                  <input
                    type="text"
                    value={editedListTitle}
                    onChange={(e) => setEditedListTitle(e.target.value)}
                    onBlur={() => saveListTitle(list.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveListTitle(list.id);
                      if (e.key === "Escape") cancelListEdit();
                    }}
                    autoFocus
                    className="bg-orange-300 text-amber-950 border-b border-amber-950 focus:outline-none text-sm ml-2 flex-1"
                  />
                ) : (
                  <h2
                    className="font-semibold text-amber-950 text-sm ml-2 cursor-pointer"
                    onClick={() => startEditingList(list)}
                  >
                    {list.title}
                  </h2>
                )}

                <div className="flex gap-1">
                  <button
                    type="button"
                    className="text-amber-950 hover:text-xl text-lg relative"
                    title="Delete list"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setConfirmingDelete({
                        type: 'list',
                        listId: list.id,
                        position: { top: rect.bottom, left: rect.left }
                      });
                    }}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>

              <ul className="space-y-2 mb-3">
                {list.taskItems.map(task => (
                  <li
                    key={task.id}
                    className="group bg-white text-gray-600 text-left font-opensans py-4 rounded-lg text-sm flex items-center justify-between px-3 relative"
                  >
                    {/* Done toggle circle */}
                    <button
                      onClick={() => toggleTaskDone(list.id, task)}
                      className={`
                        absolute left-3
                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${task.isCompleted ? "bg-green-500 border-green-500" : "border-gray-400"}
                        ${task.isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                        transition-opacity
                      `}
                    >
                      {task.isCompleted && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </button>

                    {/* Title */}
                    <div className={`flex-1 transition-all ${task.isCompleted ? "pl-6" : "group-hover:pl-6"}`}>
                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onBlur={() => saveTaskTitle(list.id, task.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTaskTitle(list.id, task.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className="border-b border-gray-300 focus:outline-none w-full"
                        />
                      ) : (
                        <span
                          onClick={() => startEditing(task)}
                          className={`cursor-pointer ${task.isCompleted ? "line-through text-gray-400" : ""}`}
                        >
                          {task.title}
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 text-lg ml-2 relative"
                      title="Delete task"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setConfirmingDelete({
                          type: 'task',
                          taskId: task.id,
                          listId: list.id,
                          position: { top: rect.bottom, left: rect.left }
                        });
                      }}
                    >
                      <MdDeleteOutline />
                    </button>
                  </li>
                ))}
              </ul>

              {addingTaskForListId === list.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAddingTaskForListId(null);
                    submitAddTask(e, list.id);
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setTaskTitle(list.id, "");
                      setAddingTaskForListId(null);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={newTaskTitles[list.id] || ""}
                    onChange={(e) => setTaskTitle(list.id, e.target.value)}
                    placeholder="Add new task..."
                    className="w-full rounded-lg px-3 py-2 text-sm mb-2 bg-transparent text-orange-500 placeholder:text-pink-200"
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
                      onClick={() => {
                        setTaskTitle(list.id, "");
                        setAddingTaskForListId(null);
                      }}
                      className="py-1 bg-transparent text-amber-950 text-xl"
                    >
                      <RxCross1 />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setAddingTaskForListId(list.id)}
                  className="text-white/90 hover:text-white text-sm mt-2"
                >
                  + Add Task
                </button>
              )}
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

    {/* Confirmation popover */}
    {confirmingDelete && (
      <div
        className="absolute bg-white shadow-lg rounded-md p-3 text-sm z-50"
        style={{
          top: confirmingDelete.position.top + window.scrollY,
          left: confirmingDelete.position.left
        }}
      >
        <p className="mb-2">
          {confirmingDelete.type === 'task'
            ? 'Delete this task?'
            : 'Delete this list?'}
        </p>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-orange-600 text-white rounded"
            onClick={() => {
              if (confirmingDelete.type === 'task') {
                const list = board.taskLists.find(l => l.id === confirmingDelete.listId);
                const task = list.taskItems.find(t => t.id === confirmingDelete.taskId);
                handleDeleteTask(list, task);
              } else {
                const list = board.taskLists.find(l => l.id === confirmingDelete.listId);
                handleDeleteList(list);
              }
              setConfirmingDelete(null);
            }}
          >
            Yes
          </button>
          <button
            className="px-2 py-1 bg-gray-200 rounded"
            onClick={() => setConfirmingDelete(null)}
          >
            No
          </button>
        </div>
      </div>
    )}
  </div>
);

}