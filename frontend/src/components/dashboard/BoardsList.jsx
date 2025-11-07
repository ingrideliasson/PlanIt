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
  currentUserId,
}) {
  if (loading) {
    return <p className="text-white font-montserrat">Loading boards...</p>;
  }
  if (!boards?.length) {
    return <p className="text-white font-montserrat">No boards yet</p>;
  }
  return (
    <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
      {boards.map((board) => {
        // Check both camelCase and PascalCase for role property
        const role = board.role || board.Role;
        // Fallback: if role is not available, check if we have ownerId and compare with current user
        // This is a temporary workaround until backend is restarted
        const isOwner = role === "Owner" || (board.ownerId && currentUserId && board.ownerId === currentUserId);
        // Temporary debug - remove after verifying
        if (process.env.NODE_ENV === 'development') {
          console.log("Board:", board.id, "Title:", board.title, "Role:", role, "ownerId:", board.ownerId, "currentUserId:", currentUserId, "isOwner:", isOwner);
        }
        return (
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
            isOwner={isOwner}
          />
        );
      })}
    </div>
  );
}


