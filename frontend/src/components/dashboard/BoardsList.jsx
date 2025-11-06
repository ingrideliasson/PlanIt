import React from "react";
import BoardCard from "./BoardCard";

export default function BoardsList({
  boards,
  loading,
  editingBoardId,
  editedBoardTitle,
  onChangeEditedTitle,
  onSaveBoardTitle,
  onCancelBoardEdit,
  onStartBoardEdit,
  onAskDelete,
  onOpenBoard,
}) {
  if (loading) {
    return <p className="text-white font-montserrat">Loading boards...</p>;
  }
  if (!boards?.length) {
    return <p className="text-white font-montserrat">No boards yet</p>;
  }
  return (
    <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          isEditing={editingBoardId === board.id}
          editedTitle={editedBoardTitle}
          onChangeTitle={onChangeEditedTitle}
          onSave={() => onSaveBoardTitle(board.id)}
          onCancel={onCancelBoardEdit}
          onStartEdit={() => onStartBoardEdit(board)}
          onAskDelete={(position) => onAskDelete(board.id, position)}
          onOpen={() => onOpenBoard(board.id)}
        />
      ))}
    </div>
  );
}


