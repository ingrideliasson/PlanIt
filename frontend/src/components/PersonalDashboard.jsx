import { useState, useEffect } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import Header from "./Header";
import api, { setAuthToken } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PersonalDashboard({ onLogout }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set token and fetch boards on mount
  useEffect(() => {
    async function fetchBoards() {
      try {
        const token = localStorage.getItem("token");
        setAuthToken(token);

        const response = await api.get("/userboards/mine");
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
  async function handleCreateBoard() {
    const title = prompt("Enter board title:");
    if (!title) return;

    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      const response = await api.post("/userboards", { Title: title });
      setBoards([...boards, response.data]);
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Make sure you are logged in.");
    }
  }

  // EDIT board
  async function handleEditBoard(board) {
    const newTitle = prompt("Enter new title", board.title);
    if (!newTitle) return;

    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      await api.put(`/userboards/${board.id}`, { Title: newTitle });
      setBoards(boards.map(b => (b.id === board.id ? { ...b, title: newTitle } : b)));
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board.");
    }
  }

  // DELETE board
  async function handleDeleteBoard(boardId) {
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      await api.delete(`/userboards/${boardId}`);
      setBoards(boards.filter(b => b.id !== boardId));
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("Failed to delete board.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-fuchsia-800 via-pink-800 to-yellow-400">
      <Header onLogout={onLogout} />

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
                      className="w-full py-4 md:py-6 px-4 rounded-xl bg-fuchsia-900  text-white font-montserrat text-lg flex justify-between items-center "
                    >
                      <span
                        className="cursor-pointer"
                        onClick={() => navigate(`/boards/${board.id}`)}
                      >
                        {board.title}
                      </span>

                      <div className="space-x-2">
                        <button
                          className="text-pink-600 text-sm font-opensans hover:underline"
                          onClick={() => handleEditBoard(board)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-pink-600 text-sm font-opensans hover:underline hover:text-pink-600"
                          onClick={() => handleDeleteBoard(board.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Add New Board */}
                <button
                  type="button"
                  className="w-full py-4 md:py-6 rounded-xl text-white text-lg
                            bg-fuchsia-900 opacity-50 hover:opacity-100 font-montserrat"
                  onClick={handleCreateBoard}
                >
                  Add new...
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}


