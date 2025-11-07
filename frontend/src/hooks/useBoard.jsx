import { useEffect, useState, useCallback } from "react";
import api, { setAuthToken } from "../services/api";

export default function useBoard(boardId) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

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
  const [assigningTask, setAssigningTask] = useState(null);
  const [showAddMembers, setShowAddMembers] = useState(false);

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);
      const res = await api.get(`/boards/${boardId}/details`);
      setBoard(res.data);
    } catch (err) {
      console.error("Failed to load board:", err);
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    
    if (boardId) {
      fetchBoard();
    } else {
      setLoading(false);
      setBoard(null);
    }
  }, [boardId, fetchBoard]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) setAuthToken(token);
        const res = await api.get(`/boards/${boardId}/users`);
        setMembers(res.data.map(m => ({ ...m, applicationUserId: String(m.applicationUserId) })));
      } catch (err) {
        console.error("Failed to fetch board members:", err);
      }
    };
    if (boardId) fetchMembers();
  }, [boardId]);

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
      const res = await api.post("/tasklists", { title, boardId: board.id });
      setBoard(prev => ({
        ...prev,
        taskLists: [
          ...prev.taskLists,
          { id: res.data.id, title: res.data.title, taskItems: [], colorIndex: res.data.colorIndex, position: res.data.position }
        ]
      }));
      setNewListTitle("");
      setAddingList(false);
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
            ? { ...list, taskItems: list.taskItems.map(t => (t.id === taskId ? { ...t, title: editedTitle } : t)) }
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
        taskLists: prev.taskLists.map(list => (list.id === listId ? { ...list, taskItems: [...list.taskItems, res.data] } : list))
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
        taskLists: prev.taskLists.map(l => (l.id === list.id ? { ...l, taskItems: l.taskItems.filter(t => t.id !== task.id) } : l))
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
        isCompleted: !task.isCompleted,
      });
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(l =>
          l.id === listId
            ? { ...l, taskItems: l.taskItems.map(t => (t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t)) }
            : l
        )
      }));
    } catch (err) {
      console.error("Error toggling task:", err);
      alert("Failed to update task.");
    }
  }

  const openAssignModal = (task) => {
    if (!board) return;
    setAssigningTask(task);
  };

  const closeAssignModal = () => setAssigningTask(null);

  const handleAssignUser = async (taskId, userId) => {
    const member = members.find(m => m.applicationUserId === String(userId));
    if (!member) return alert("User not found");
    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(list => ({
        ...list,
        taskItems: list.taskItems.map(task => {
          if (task.id !== taskId) return task;
          if (task.assignedUsers?.some(u => u.applicationUserId === member.applicationUserId)) return task;
          return { ...task, assignedUsers: [...(task.assignedUsers || []), member] };
        })
      }))
    }));
    try {
      await api.post(`/taskitems/${taskId}/assignments`, { ApplicationUserId: member.applicationUserId });
    } catch (err) {
      console.error(err);
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(list => ({
          ...list,
          taskItems: list.taskItems.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, assignedUsers: task.assignedUsers.filter(u => u.applicationUserId !== member.applicationUserId) };
          })
        }))
      }));
      alert("Failed to assign user");
    }
  };

  const handleUnassignUser = async (taskId, userId) => {
    const normalizedId = String(userId);
    setBoard(prev => ({
      ...prev,
      taskLists: prev.taskLists.map(list => ({
        ...list,
        taskItems: list.taskItems.map(task => {
          if (task.id !== taskId) return task;
          return { ...task, assignedUsers: task.assignedUsers.filter(u => u.applicationUserId !== normalizedId) };
        })
      }))
    }));
    try {
      await api.delete(`/taskitems/${taskId}/assignments/${encodeURIComponent(normalizedId)}`);
    } catch (err) {
      console.error(err);
      const member = members.find(m => m.applicationUserId === normalizedId);
      if (!member) return;
      setBoard(prev => ({
        ...prev,
        taskLists: prev.taskLists.map(list => ({
          ...list,
          taskItems: list.taskItems.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, assignedUsers: [...(task.assignedUsers || []), member] };
          })
        }))
      }));
      alert("Failed to unassign user");
    }
  };

  async function handleDragEnd(result) {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    
    const sourceIndex = source.index;
    const destIndex = destination.index;
    if (source.index === destIndex && source.droppableId === destination.droppableId) return;

    // Handle list dragging
    if (type === "LIST") {
      // draggableId is in format "list-{id}"
      const listId = parseInt(draggableId.replace("list-", ""));
      
      console.log("Moving list:", { listId, sourceIndex, destIndex, type });
      
      // Calculate the final destination index before state update
      const sortedLists = [...board.taskLists].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      const finalDestIndex = Math.min(Math.max(destIndex, 0), sortedLists.length - 1);
      
      // Optimistically update UI - ensure we work with sorted lists
      setBoard(prev => {
        if (!prev || !prev.taskLists) return prev;
        
        // Get sorted lists to match what's rendered
        const sortedLists = [...prev.taskLists].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        
        // Deep copy lists to avoid mutations
        const listsCopy = sortedLists.map(list => ({
          ...list,
          taskItems: list.taskItems ? list.taskItems.map(task => ({ ...task })) : []
        }));
        
        // Move the list
        if (sourceIndex < 0 || sourceIndex >= listsCopy.length) {
          console.error("Invalid source index:", sourceIndex);
          return prev;
        }
        
        const [movedList] = listsCopy.splice(sourceIndex, 1);
        listsCopy.splice(finalDestIndex, 0, movedList);
        
        // Create new objects with updated positions
        const updatedLists = listsCopy.map((list, i) => ({ ...list, position: i }));
        
        console.log("Updated lists positions:", updatedLists.map(l => ({ id: l.id, position: l.position })));
        
        return { ...prev, taskLists: updatedLists };
      });
      
      try {
        const token = localStorage.getItem("token");
        if (token) setAuthToken(token);
        console.log("Calling API with position:", finalDestIndex);
        const response = await api.put(`/tasklists/${listId}/move`, { position: finalDestIndex });
        console.log("List move successful:", response.status);
      } catch (err) {
        console.error("Failed to move list:", err);
        console.error("Error details:", err.response?.data || err.message);
        // Revert on error
        fetchBoard();
      }
      return;
    }

    // Handle task dragging (existing logic)
    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
    const taskId = parseInt(draggableId);
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
      await api.put(`/taskitems/${taskId}/move`, { taskListId: parseInt(destListId), position: destIndex });
    } catch (err) {
      console.error("Failed to move task:", err);
      fetchBoard();
    }
  }

  // Helper functions for delete confirmation
  const handleConfirmDelete = () => {
    if (!confirmingDelete || !board) return;

    if (confirmingDelete.type === "task") {
      const list = board.taskLists.find(l => l.id === confirmingDelete.listId);
      const task = list.taskItems.find(t => t.id === confirmingDelete.taskId);
      handleDeleteTask(list, task);
    } else {
      const list = board.taskLists.find(l => l.id === confirmingDelete.listId);
      handleDeleteList(list);
    }
    setConfirmingDelete(null);
  };

  const handleAskDeleteList = (e, list) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setConfirmingDelete({
      type: "list",
      listId: list.id,
      position: { top: rect.bottom, left: rect.left },
    });
  };

  const handleAskDeleteTask = (listId, taskId, rect) => {
    setConfirmingDelete({
      type: "task",
      taskId: taskId,
      listId: listId,
      position: { top: rect.bottom, left: rect.left },
    });
  };

  return {
    board,
    loading,
    members,
    setMembers,
    showAddMembers,
    setShowAddMembers,
    addingList,
    setAddingList,
    newListTitle,
    setNewListTitle,
    addListLoading,
    submitAddList,
    handleDeleteList,
    handleDeleteTask,
    newTaskTitles,
    setTaskTitle,
    addTaskLoading,
    addingTaskForListId,
    setAddingTaskForListId,
    submitAddTask,
    editingTaskId,
    editedTitle,
    startEditingTask,
    setEditedTitle,
    saveTaskTitle,
    cancelTaskEdit,
    editingListId,
    editedListTitle,
    startEditingList,
    setEditedListTitle,
    saveListTitle,
    cancelListEdit,
    confirmingDelete,
    setConfirmingDelete,
    handleConfirmDelete,
    handleAskDeleteList,
    handleAskDeleteTask,
    assigningTask,
    setAssigningTask,
    openAssignModal,
    closeAssignModal,
    handleAssignUser,
    handleUnassignUser,
    toggleTaskDone,
    handleDragEnd,
  };
}


