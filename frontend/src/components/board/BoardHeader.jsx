import React from "react";
import MemberAvatars from "../MemberAvatars";
import AddMembersModal from "../AddMembersModal";

export default function BoardHeader({
  board,
  currentUser,
  members,
  showAddMembers,
  onShowAddMembers,
  onCloseAddMembers,
  onMemberAdded,
}) {
  return (
    <>
      <h1 className="text-neutral-700 tracking-wider text-3xl font-montserrat pl-8 px-6 mb-6">
        {board.title}
      </h1>

      <div className="flex items-center ml-7 mb-4">
        <MemberAvatars
          members={members}
          size={32}
          showBorder={false}
          className="mr-4"
        />

        {board && currentUser && board.ownerId === currentUser.sub && (
          <button
            className="px-3 py-1 text-neutral-500 hover:underline text-left text-sm"
            onClick={onShowAddMembers}
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
          onClose={onCloseAddMembers}
          onMemberAdded={onMemberAdded}
        />
      )}
    </>
  );
}

