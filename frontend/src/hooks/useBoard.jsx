import { useEffect, useState } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    if (boardId) fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  async function fetchBoard() {
    setLoading(true);
    try {
      const res = await api.get(`/boards/${boardId}/details`);
      setBoard(res.data);
    } catch (err) {
      console.error("Failed to load board:", err);
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
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
          { id: res.data.id, title: res.data.title, taskItems: [], colorIndex: res.data.colorIndex }
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

  const openAssignModal = (taskId) => {
    if (!board) return;
    const taskFromState = board.taskLists.flatMap(list => list.taskItems).find(task => task.id === taskId);
    setAssigningTask(taskFromState);
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
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
    const sourceIndex = source.index;
    const destIndex = destination.index;
    if (sourceListId === destListId && sourceIndex === destIndex) return;
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

  return {
    board,
    loading,
    members,
    setMembers,
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


