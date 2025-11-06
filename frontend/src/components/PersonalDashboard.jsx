import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import useCurrentUser from "../hooks/useCurrentUser";
import { RxCross1 } from "react-icons/rx";
import BoardsList from "./dashboard/BoardsList";
import Button from "./ui/Button";
import TextInput from "./ui/TextInput";
import ConfirmPopover from "./shared/ConfirmPopover";
import useBoards from "../hooks/useBoards";

export default function PersonalDashboard({ onLogout }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const {
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
  } = useBoards();

  return (
    <div className="min-h-screen flex flex-col bg-background-100 relative">
      <Header 
      onLogout={onLogout}
      currentUser={user} />

      <main className="flex-1 flex items-center py-8 sm:py-10 lg:py-14">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-8 md:gap-12 lg:gap-16">
            {/* Welcome Text */}
            <div className="text-surface-900 font-playfair text-center">
              <h1 className="tracking-wider text-5xl md:text-6xl lg:text-8xl leading-[1.05] text-amber-950">
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
              <h2 className="text-amber-950 font-montserrat text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-8 text-center">
                Your boards
              </h2>

              <BoardsList
                boards={boards}
                loading={loading}
                editingBoardId={editingBoardId}
                editedBoardTitle={editedBoardTitle}
                onChangeEditedTitle={setEditedBoardTitle}
                onSaveBoardTitle={saveBoardTitle}
                onCancelBoardEdit={cancelBoardEdit}
                onStartBoardEdit={startBoardEdit}
                onAskDelete={(boardId, position) => setConfirmingDelete({ type: "board", boardId, position })}
                onOpenBoard={(boardId) => navigate(`/boards/${boardId}`)}
              />
              <div className="mt-4">
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
                    <TextInput
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Enter title"
                      className="mb-4 px-3 py-6"
                      autoFocus
                    />
                    <div className="flex gap-2 pl-2">
                      <Button type="submit" disabled={addBoardLoading} variant="primary" size="sm">
                        {addBoardLoading ? "Adding…" : "Add"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingBoard(false);
                          setNewBoardTitle("");
                        }}
                        className="py-1 text-amber-950 text-xl"
                      >
                        < RxCross1 />
                      </button>
                    </div>
                  </form>
                ) : (
                  <Button type="button" className="w-full py-4 md:py-6 px-4 rounded-xl bg-transparent text-amber-950 font-montserrat text-lg flex" onClick={() => setAddingBoard(true)}>
                    + Add new board
                  </Button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <ConfirmPopover
        position={confirmingDelete?.position}
        message={confirmingDelete ? "Delete this board?" : ""}
        onConfirm={() => {
          if (!confirmingDelete) return;
          handleDeleteBoard(confirmingDelete.boardId);
          setConfirmingDelete(null);
        }}
        onCancel={() => setConfirmingDelete(null)}
      />
    </div>
  );
}



