import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";
import Header from "./Header";
import useCurrentUser from "../hooks/useCurrentUser";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

export default function PersonalDashboard({ onLogout }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add board UI state
  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [addBoardLoading, setAddBoardLoading] = useState(false);

  // Edit board UI state
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editedBoardTitle, setEditedBoardTitle] = useState("");

  // Delete confirmation popover
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const popoverRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setConfirmingDelete(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch boards on mount
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

  // CREATE board
  async function submitAddBoard(e) {
    e.preventDefault();
    const title = newBoardTitle.trim();
    if (!title) return;
    setAddBoardLoading(true);
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      const response = await api.post("/boards", { title });
      setBoards(prev => [...prev, response.data]);
      setNewBoardTitle("");
      setAddingBoard(false);
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Make sure you are logged in.");
    } finally {
      setAddBoardLoading(false);
    }
  }

  // EDIT board
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
      setBoards(prev =>
        prev.map(b => (b.id === boardId ? { ...b, title } : b))
      );
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board.");
    } finally {
      cancelBoardEdit();
    }
  }

  // DELETE board
  async function handleDeleteBoard(boardId) {
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      await api.delete(`/boards/${boardId}`);
      setBoards(prev => prev.filter(b => b.id !== boardId));
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("Failed to delete board.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-fuchsia-800 via-pink-800 to-yellow-400 relative">
      <Header 
      onLogout={onLogout}
      currentUser={user} />

      <main className="flex-1 flex items-center py-8 sm:py-10 lg:py-14">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-8 md:gap-12 lg:gap-16">
            {/* Welcome Text */}
            <div className="text-white font-playfair text-center">
              <h1 className="tracking-tight text-6xl md:text-7xl lg:text-9xl leading-[1.05]">
                {user ? (
                  <>
                    Welcome,<br />
                    <span className="inline-block text-center">{user.firstName}!</span>
                  </>
                ) : (
                  "Loading..."
                )}
              </h1>
            </div>

            {/* Boards Section */}
            <section className="justify-self-center lg:justify-self-start w-full max-w-xs sm:max-w-sm md:max-w-sm">
              <h2 className="text-white font-montserrat text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-8 text-center">
                Your boards
              </h2>

              <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                {loading ? (
                  <p className="text-white font-montserrat">Loading boards...</p>
                ) : boards.length === 0 ? (
                  <p className="text-white font-montserrat">No boards yet</p>
                ) : (
                  boards.map(board => (
                    <div
                      key={board.id}
                      className="w-full py-4 md:py-6 px-4 rounded-xl bg-fuchsia-900 text-white font-montserrat text-lg flex justify-between items-center hover:underline"
                    >
                      {editingBoardId === board.id ? (
                        <input
                          type="text"
                          value={editedBoardTitle}
                          onChange={(e) => setEditedBoardTitle(e.target.value)}
                          onBlur={() => saveBoardTitle(board.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveBoardTitle(board.id);
                            if (e.key === "Escape") cancelBoardEdit();
                          }}
                          autoFocus
                          className="bg-fuchsia-800 text-white rounded-md focus:outline-none "
                        />
                      ) : (
                        <span
                          className="cursor-pointer"
                          onClick={() => navigate(`/boards/${board.id}`)}
                        >
                          {board.title}
                        </span>
                      )}

                      <div className="space-x-2">
                        <button
                          className="text-amber-500 text-xl hover:text-amber-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            startBoardEdit(board);
                          }}
                        >
                          < CiEdit />
                        </button>
                        <button
                          className="text-amber-600 text-xl hover:text-amber-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setConfirmingDelete({
                              type: "board",
                              boardId: board.id,
                              position: { top: rect.bottom, left: rect.left }
                            });
                          }}
                        >
                          < MdDeleteOutline />
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Add New Board */}
                {addingBoard ? (
                  <form
                    onSubmit={submitAddBoard}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setAddingBoard(false);
                        setNewBoardTitle("");
                      }
                    }}
                  >
                    <input
                      type="text"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Enter title"
                      className="w-full rounded-xl mb-4 px-3 py-6 text-md mb-2 bg-transparent opacity-70 text-white placeholder:text-gray-300 pl-4 font-montserrat focus:outline-none focus:bg-fuchsia-900"
                      autoFocus
                    />
                    <div className="flex gap-2 pl-2">
                      <button
                        type="submit"
                        disabled={addBoardLoading}
                        className="px-3 py-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-sm"
                      >
                        {addBoardLoading ? "Adding…" : "Add"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingBoard(false);
                          setNewBoardTitle("");
                        }}
                        className="py-1 bg-transparent text-white text-xl"
                      >
                        < RxCross1 />
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="w-full py-4 md:py-6 rounded-xl text-white text-lg bg-fuchsia-900 opacity-50 hover:opacity-100 font-montserrat"
                  onClick={() => setAddingBoard(true)}
                >
                  + Add new board
                </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Confirmation popover */}
      {confirmingDelete && (
        <div
          ref={popoverRef}
          className="absolute bg-white shadow-lg rounded-md p-3 text-sm z-50"
          style={{
            top: confirmingDelete.position.top + window.scrollY,
            left: confirmingDelete.position.left
          }}
        >
          <p className="mb-2 font-montserrat">
            {confirmingDelete.type === "board"
              ? "Delete this board?"
              : "Are you sure?"}
          </p>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 bg-orange-600 text-white rounded font-montserrat"
              onClick={() => {
                if (confirmingDelete.type === "board") {
                  handleDeleteBoard(confirmingDelete.boardId);
                }
                setConfirmingDelete(null);
              }}
            >
              Yes
            </button>
            <button
              className="px-2 py-1 bg-gray-200 rounded font-montserrat"
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



