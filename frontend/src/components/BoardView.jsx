import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../services/api";
import Header from "./Header";
import MemberAvatars from "./MemberAvatars";
import AddMembersModal from "./AddMembersModal";
import { RxCross1 } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import UserSettingsModal from "./UserSettingsModal";


export default function BoardView({ onLogout, currentUser }) {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addListLoading, setAddListLoading] = useState(false);

  const [newTaskTitles, setNewTaskTitles] = useState({});
  const [addTaskLoading, setAddTaskLoading] = useState({});
  const [addingTaskForListId, setAddingTaskForListId] = useState(null);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const [editingListId, setEditingListId] = useState(null);
  const [editedListTitle, setEditedListTitle] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const [showAddMembers, setShowAddMembers] = useState(false);
  const [members, setMembers] = useState([]);

  const [showUserSettings, setShowUserSettings] = useState(false);


  // --- Fetch board ---
  async function fetchBoard() {
    setLoading(true);
    try {
      const res = await api.get(`/boards/${id}/details`);
      setBoard(res.data);
    } catch (err) {
      console.error("Failed to load board:", err);
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchBoard();
  }, [id]);

  // --- Fetch board members ---
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/boards/${id}/users`);
        // Ensure applicationUserId is always a string
        setMembers(res.data.map(m => ({ ...m, applicationUserId: String(m.applicationUserId) })));
      } catch (err) {
        console.error("Failed to fetch board members:", err);
      }
    };
    if (id) fetchMembers();
  }, [id]);

  // --- List actions ---
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
      await api.put(`/tasklists/${listId}`, { title });
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(l => (l.id === listId ? { ...l, title } : l))
      }));
    } catch (err) {
      console.error("Failed to update list title:", err);
      alert("Failed to update list.");
    } finally {
      cancelListEdit();
    }
  }

  async function submitAddList(e) {
    e.preventDefault();
    const title = (newListTitle || "").trim();
    if (!title) return;
    setAddListLoading(true);
    try {
      await api.post("/tasklists", { title, boardId: board.id });
      setNewListTitle("");
      setAddingList(false);
      await fetchBoard();
    } catch (err) {
      console.error("Failed to add list:", err);
    } finally {
      setAddListLoading(false);
    }
  }

  async function handleDeleteList(list) {
    try {
      await api.delete(`/tasklists/${list.id}`);
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.filter(l => l.id !== list.id)
      }));
    } catch (err) {
      console.error("Error deleting list", err);
      alert("Failed to delete list.");
    }
  }

  // --- Task actions ---
  function startEditingTask(task) {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  }

  function cancelTaskEdit() {
    setEditingTaskId(null);
    setEditedTitle("");
  }

  async function saveTaskTitle(listId, taskId) {
    try {
      await api.put(`/taskitems/${taskId}`, { title: editedTitle, isCompleted: false });
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(list =>
          list.id === listId
            ? {
                ...list,
                taskItems: list.taskItems.map(t => (t.id === taskId ? { ...t, title: editedTitle } : t))
              }
            : list
        )
      }));
    } finally {
      cancelTaskEdit();
    }
  }

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
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(list =>
          list.id === listId ? { ...list, taskItems: [...list.taskItems, res.data] } : list
        )
      }));
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setAddTaskLoading(prev => ({ ...prev, [listId]: false }));
    }
  }

  async function handleDeleteTask(list, task) {
    try {
      await api.delete(`/taskitems/${task.id}`);
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(l =>
          l.id === list.id ? { ...l, taskItems: l.taskItems.filter(t => t.id !== task.id) } : l
        )
      }));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  }

  async function toggleTaskDone(listId, task) {
    try {
      await api.put(`/taskitems/${task.id}`, {
        title: task.title,
        description: task.description,
        isCompleted: !task.isCompleted
      });
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(l =>
          l.id === listId
            ? {
                ...l,
                taskItems: l.taskItems.map(t => (t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t))
              }
            : l
        )
      }));
    } catch (err) {
      console.error("Error toggling task:", err);
      alert("Failed to update task.");
    }
  }

  // --- Drag & drop ---
  async function handleDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
    const sourceIndex = source.index;
    const destIndex = destination.index;

    if (sourceListId === destListId && sourceIndex === destIndex) return;

    const taskId = parseInt(draggableId);

    // Optimistic update
    setBoard(prev => {
      const listsCopy = prev.taskLists.map(list => ({ ...list, taskItems: [...list.taskItems] }));
      const sourceList = listsCopy.find(l => String(l.id) === sourceListId);
      const destList = listsCopy.find(l => String(l.id) === destListId);
      const [movedTask] = sourceList.taskItems.splice(sourceIndex, 1);
      destList.taskItems.splice(destIndex, 0, movedTask);
      sourceList.taskItems.forEach((t, i) => (t.position = i));
      destList.taskItems.forEach((t, i) => (t.position = i));
      return { ...prev, taskLists: listsCopy };
    });

    try {
      await api.put(`/taskitems/${taskId}/move`, {
        taskListId: parseInt(destListId),
        position: destIndex
      });
    } catch (err) {
      console.error("Failed to move task:", err);
      fetchBoard();
    }
  }

  const handleSaveSettings = async (prefs) => {
  try {
    // persist to backend
    await api.put(`/users/${currentUser.id}/preferences`, prefs);

    // optionally, refresh current user info from backend
    const res = await api.get(`/users/${currentUser.id}`);
    // update any local state/UI if needed
    setShowUserSettings(false);
  } catch (err) {
    console.error("Failed to save settings:", err);
    alert("Could not save user settings.");
  }
};

  if (loading) return <div className="p-6">Loading...</div>;
  if (!board) return <div className="p-6">Board not found</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-fuchsia-800 via-pink-800 to-yellow-400 font-montserrat relative">
        
        <Header 
        onLogout={onLogout}
        currentUser={currentUser}
        onOpenSettings={() => setShowUserSettings(true)}
        />

        {showUserSettings && (
          <UserSettingsModal
            user={currentUser}
            onClose={() => setShowUserSettings(false)}
            onSave={handleSaveSettings}
          />
        )}


        <div className="flex flex-col flex-1 min-h-0">
          
          <h1 className="text-white text-3xl font-montserrat pl-8 px-6 mb-4">{board.title}</h1>
          
          <div className="flex items-center ml-6 mb-4">
            <MemberAvatars members={members} 
            className="mr-4"/>


          {board && currentUser && board.ownerId === currentUser.sub && (
            <button
              className="px-3 py-1 text-amber-600 hover:underline text-left text-sm"
              onClick={() => setShowAddMembers(true)}
            >
              Handle members
            </button>
          )}
          </div>
        
        {showAddMembers && (
        <AddMembersModal
          boardId={board.id}
          existingMembers={members}
          currentUserId={currentUser.sub}
          onClose={() => setShowAddMembers(false)}
          onMemberAdded={(user) => {
            if (user.removed) {
              setMembers((prev) => prev.filter(m => m.applicationUserId !== user.applicationUserId));
            } else {
              setMembers(prev => [...prev, { ...user, applicationUserId: user.applicationUserId }]);
            }
          }}
        />
      )}

          <div className="flex-1 px-6 pb-6 overflow-x-auto overflow-y-hidden board-scroll" style={{ minHeight: 0, scrollbarWidth: 'thin' }}>
            <div className="flex gap-6 min-w-max items-start">
              {board.taskLists.map(list => (
                <Droppable key={list.id} droppableId={list.id.toString()}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="bg-orange-400 rounded-2xl p-4 flex-shrink-0 w-64 flex flex-col relative">
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
                            {list.title ?? ""}
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
                        {list.taskItems
                          .sort((a, b) => a.position - b.position)
                          .map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`group bg-white text-gray-600 text-left font-opensans py-4 rounded-lg text-sm flex items-center justify-between px-3 relative ${snapshot.isDragging ? "shadow-lg" : ""}`}
                                >
                                  <button
                                    onClick={() => toggleTaskDone(list.id, task)}
                                    className={`absolute left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${task.isCompleted ? "bg-green-500 border-green-500" : "border-gray-400"} ${task.isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                                  >
                                    {task.isCompleted && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                  </button>

                                  <div className={`flex-1 transition-all ${task.isCompleted ? "pl-6" : "group-hover:pl-6"}`}>
                                    {editingTaskId === task.id ? (
                                      <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        onBlur={() => saveTaskTitle(list.id, task.id)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") saveTaskTitle(list.id, task.id);
                                          if (e.key === "Escape") cancelTaskEdit();
                                        }}
                                        autoFocus
                                        className="border-b border-gray-300 focus:outline-none w-full"
                                      />
                                    ) : (
                                      <span onClick={() => startEditingTask(task)} className={`cursor-pointer ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
                                        {task.title ?? ""}
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700 text-md ml-2 relative"
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
                                    <RxCross1 />
                                  </button>
                                </li>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </ul>

                      {addingTaskForListId === list.id ? (
                        <form
                          onSubmit={(e) => { e.preventDefault(); setAddingTaskForListId(null); submitAddTask(e, list.id); }}
                          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setTaskTitle(list.id, ""); setAddingTaskForListId(null); } }}
                        >
                          <input
                            type="text"
                            value={newTaskTitles[list.id] || ""}
                            onChange={(e) => setTaskTitle(list.id, e.target.value)}
                            placeholder="Enter title..."
                            autoFocus
                            className="w-full rounded-lg px-3 py-2 text-sm mb-2 bg-transparent text-amber-900 focus:outline-none placeholder:text-amber-700"
                          />
                          <div className="flex gap-2">
                            <button type="submit" disabled={addTaskLoading[list.id]} className="px-3 py-1 rounded-lg bg-amber-700 text-white text-sm hover:bg-amber-800">
                              {addTaskLoading[list.id] ? "Adding…" : "Add"}
                            </button>
                            <button type="button" onClick={() => { setTaskTitle(list.id, ""); setAddingTaskForListId(null); }} className="py-1 bg-transparent text-amber-950 text-xl">
                              <RxCross1 />
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button onClick={() => setAddingTaskForListId(list.id)} className="text-amber-900 hover:text-white text-sm text-left">
                          <div className="p-2 rounded-lg hover:bg-amber-700">+ Add Task</div>
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              ))}

              {/* Add new list card */}
              <div className="bg-orange-400 text-amber-950 font-montserrat rounded-lg text-sm p-4 flex-shrink-0 w-64 flex flex-col justify-center">
                {addingList ? (
                  <form id="add-list-form" onSubmit={submitAddList} className="flex flex-col">
                    <input
                      id="new-list-input"
                      autoFocus
                      type="text"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      className="bg-transparent text-center w-full border-b border-amber-950 pb-2 mb-3 focus:outline-none placeholder:text-amber-700"
                    />
                    <div className="flex gap-2 justify-center">
                      <button type="submit" disabled={addListLoading} className="px-3 py-1 rounded-lg bg-amber-700 text-white hover:bg-amber-800">
                        {addListLoading ? "Adding…" : "Add"}
                      </button>
                      <button type="button" onClick={() => { setAddingList(false); setNewListTitle(""); }} className="py-1 text-amber-950 text-xl">
                        <RxCross1 />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <button onClick={() => setAddingList(true)} className="text-amber-900 hover:font-semibold">
                      + Add new list
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation popover */}
        {confirmingDelete && (
          <div className="absolute bg-white shadow-lg rounded-md p-3 text-sm z-50" style={{ top: confirmingDelete.position.top + window.scrollY, left: confirmingDelete.position.left }}>
            <p className="mb-2">
              {confirmingDelete.type === 'task' ? 'Delete this task?' : 'Delete this list?'}
            </p>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-orange-600 text-white rounded" onClick={() => {
                if (confirmingDelete.type === 'task') {
                  const list = board.taskLists.find(l => l.id === confirmingDelete.listId);
                  const task = list.taskItems.find(t => t.id === confirmingDelete.taskId);
                  handleDeleteTask(list, task);
                } else {
                  const list = board.taskLists.find(l => l.id === confirmingDelete.listId);
                  handleDeleteList(list);
                }
                setConfirmingDelete(null);
              }}>Yes</button>
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setConfirmingDelete(null)}>No</button>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}
