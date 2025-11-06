import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoPersonAddSharp } from "react-icons/io5";
import MemberAvatars from "../MemberAvatars";

export default function TaskCard({
  task,
  listId,
  editingTaskId,
  editedTitle,
  onStartEdit,
  onChangeTitle,
  onSaveTitle,
  onCancelEdit,
  onToggleDone,
  onDelete,
  onOpenAssign,
}) {
  return (
    <li className="group bg-white text-surface-700 text-left font-opensans py-4 rounded-lg text-sm flex flex-col px-2 relative border border-surface-200">
      <button
        onClick={() => onToggleDone(listId, task)}
        className={`absolute left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${task.isCompleted ? "bg-lime-600 border-lime-600" : "border-surface-400"} ${task.isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
      >
        {task.isCompleted && <div className="w-2 h-2 rounded-full bg-white"></div>}
      </button>

      <div className={`transition-all ${task.isCompleted ? "pl-6" : "group-hover:pl-6"}`}>
        {editingTaskId === task.id ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            onBlur={() => onSaveTitle(listId, task.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveTitle(listId, task.id);
              if (e.key === "Escape") onCancelEdit();
            }}
            autoFocus
            className="border-b border-surface-300 focus:outline-none w-full"
          />
        ) : (
          <span onClick={() => onStartEdit(task)} className={`cursor-pointer ${task.isCompleted ? "line-through text-surface-400" : ""}`}>
            {task.title ?? ""}
          </span>
        )}
      </div>

      <button
        type="button"
        className="absolute top-2 right-2 text-surface-400 hover:text-surface-700"
        title="Delete task"
        onClick={onDelete}
      >
        <RxCross1 />
      </button>

      <button
        type="button"
        className="absolute top-8 right-2 text-surface-400 hover:text-primary-700 text-sm"
        onClick={() => onOpenAssign(task)}
        title="Assign members"
      >
        <IoPersonAddSharp />
      </button>

      {task.assignedUsers?.length > 0 && (
        <div className="flex flex-wrap mt-4 w-[95%]">
          <MemberAvatars members={task.assignedUsers} size={24} showBorder={false} />
        </div>
      )}
    </li>
  );
}


