import { useEffect, useState, useRef } from "react";
import api, { setAuthToken } from "../services/api";

export default function useBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [addBoardLoading, setAddBoardLoading] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editedBoardTitle, setEditedBoardTitle] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const token = localStorage.getItem("token");
        setAuthToken(token);
        const response = await api.get("/boards");
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  async function submitAddBoard(e) {
    e.preventDefault();
    const title = newBoardTitle.trim();
    if (!title) return;
    setAddBoardLoading(true);
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      const response = await api.post("/boards", { title });
      setBoards((prev) => [...prev, response.data]);
      setNewBoardTitle("");
      setAddingBoard(false);
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Make sure you are logged in.");
    } finally {
      setAddBoardLoading(false);
    }
  }

  function startBoardEdit(board) {
    setEditingBoardId(board.id);
    setEditedBoardTitle(board.title);
  }

  function cancelBoardEdit() {
    setEditingBoardId(null);
    setEditedBoardTitle("");
  }

  async function saveBoardTitle(boardId) {
    const title = editedBoardTitle.trim();
    if (!title) return cancelBoardEdit();
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      await api.put(`/boards/${boardId}`, { title });
      setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, title } : b)));
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board.");
    } finally {
      cancelBoardEdit();
    }
  }

  async function handleDeleteBoard(boardId) {
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      await api.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("Failed to delete board.");
    }
  }

  return {
    boards,
    loading,
    addingBoard,
    setAddingBoard,
    newBoardTitle,
    setNewBoardTitle,
    addBoardLoading,
    submitAddBoard,
    editingBoardId,
    editedBoardTitle,
    setEditedBoardTitle,
    startBoardEdit,
    cancelBoardEdit,
    saveBoardTitle,
    confirmingDelete,
    setConfirmingDelete,
    popoverRef,
    handleDeleteBoard,
  };
}


