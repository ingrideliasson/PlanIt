import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDeleteOutline } from "react-icons/md";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";

export default function ListColumn({
  list,
  listColors,
  editingListId,
  editedListTitle,
  onStartListEdit,
  onChangeListTitle,
  onSaveListTitle,
  onCancelListEdit,
  addingTaskForListId,
  newTaskTitle,
  addTaskLoading,
  onStartAddTask,
  onChangeTaskTitle,
  onSubmitAddTask,
  onCancelAddTask,
  editingTaskId,
  editedTaskTitle,
  onStartTaskEdit,
  onChangeTaskTitleInline,
  onSaveTaskTitle,
  onCancelTaskEdit,
  onToggleTaskDone,
  onAskDeleteList,
  onAskDeleteTask,
  onOpenAssign,
}) {
  const backgroundColor = listColors[list.colorIndex % listColors.length];

  return (
    <Droppable droppableId={list.id.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-400 rounded-2xl p-4 flex-shrink-0 w-64 flex flex-col relative shadow-md"
          style={{ backgroundColor }}
        >
          <div className="flex items-center justify-between mb-3">
            {editingListId === list.id ? (
              <input
                type="text"
                value={editedListTitle}
                onChange={(e) => onChangeListTitle(e.target.value)}
                onBlur={() => onSaveListTitle(list.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveListTitle(list.id);
                  if (e.key === "Escape") onCancelListEdit();
                }}
                autoFocus
                className="bg-white text-gray-500 border-b border-amber-950 focus:outline-none text-sm ml-2 flex-1"
              />
            ) : (
              <h2
                className="font-semibold text-neutral-700 tracking-wider text-sm ml-2 cursor-pointer"
                onClick={() => onStartListEdit(list)}
              >
                {list.title ?? ""}
              </h2>
            )}

            <div className="flex gap-1">
              <button
                type="button"
                className="text-neutral-700 hover:text-xl text-lg relative"
                title="Delete list"
                onClick={onAskDeleteList}
              >
                <MdDeleteOutline />
              </button>
            </div>
          </div>

          <ul className="space-y-2 mb-3">
            {list.taskItems
              .sort((a, b) => a.position - b.position)
              .map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className={snapshot.isDragging ? "shadow-lg" : ""}
                    >
                      <TaskCard
                        task={task}
                        listId={list.id}
                        editingTaskId={editingTaskId}
                        editedTitle={editedTaskTitle}
                        onStartEdit={onStartTaskEdit}
                        onChangeTitle={onChangeTaskTitleInline}
                        onSaveTitle={onSaveTaskTitle}
                        onCancelEdit={onCancelTaskEdit}
                        onToggleDone={onToggleTaskDone}
                        onDelete={(rect) => onAskDeleteTask(list.id, task.id, rect)}
                        onOpenAssign={onOpenAssign}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </ul>

          {addingTaskForListId === list.id ? (
            <AddTaskForm
              value={newTaskTitle}
              loading={addTaskLoading}
              onChange={(v) => onChangeTaskTitle(list.id, v)}
              onSubmit={(e) => {
                e.preventDefault();
                onCancelAddTask();
                onSubmitAddTask(e, list.id);
              }}
              onCancel={() => {
                onChangeTaskTitle(list.id, "");
                onCancelAddTask();
              }}
            />
          ) : (
            <button
              onClick={() => onStartAddTask(list.id)}
              className="text-neutral-700 hover:font-semibold text-sm text-left"
            >
              <div className="p-2 rounded-lg">+ Add Task</div>
            </button>
          )}
        </div>
      )}
    </Droppable>
  );
}


