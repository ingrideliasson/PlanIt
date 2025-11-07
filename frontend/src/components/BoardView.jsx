import React from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useBoard from "../hooks/useBoard";
import Header from "./Header";
import AssignModal from "./AssignModal";
import ConfirmPopover from "./shared/ConfirmPopover";
import BoardHeader from "./board/BoardHeader";
import ListColumn from "./board/ListColumn";
import AddListCard from "./board/AddListCard";

export default function BoardView({ onLogout, currentUser }) {
  const { id } = useParams();
  const listColors = ["#FFD4EE", "#FFC075", "#B3E4F5", "#C2E3BA", "#D1C5E8", "#FFE88F", "#FFE88F"];  

  const {
    board,
    loading,
    members,
    setMembers,
    showAddMembers,
    setShowAddMembers,
    addingList,
    setAddingList,
    newListTitle,
    setNewListTitle,
    addListLoading,
    submitAddList,
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
    handleConfirmDelete,
    handleAskDeleteList,
    handleAskDeleteTask,
    assigningTask,
    openAssignModal,
    closeAssignModal,
    handleAssignUser,
    handleUnassignUser,
    toggleTaskDone,
    handleDragEnd,
  } = useBoard(id); 


  if (loading) return <div className="p-6">Loading...</div>;
  if (!board) return <div className="p-6">Board not found</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col bg-neutral-50 font-montserrat relative">
        <Header onLogout={onLogout} currentUser={currentUser} textColor="black" />

        <div className="flex flex-col flex-1 min-h-0">
          <BoardHeader
            board={board}
            currentUser={currentUser}
            members={members}
            showAddMembers={showAddMembers}
            onShowAddMembers={() => setShowAddMembers(true)}
            onCloseAddMembers={() => setShowAddMembers(false)}
            onMemberAdded={(user) => {
              if (user.removed) {
                setMembers((prev) =>
                  prev.filter((m) => m.applicationUserId !== user.applicationUserId)
                );
              } else {
                setMembers((prev) => [
                  ...prev,
                  {
                    ...user,
                    applicationUserId: String(user.applicationUserId),
                    colorIndex: user.colorIndex ?? 0,
                  },
                ]);
              }
            }}
          />

          <div
            className="flex-1 px-6 pb-6 overflow-x-auto overflow-y-hidden board-scroll mt-8"
            style={{ minHeight: 0, scrollbarWidth: "thin" }}
          >
            <Droppable droppableId="lists" type="LIST" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-6 min-w-max items-start"
                >
                  {[...board.taskLists]
                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                    .map((list, index) => (
                      <Draggable
                        key={list.id}
                        draggableId={`list-${list.id}`}
                        index={index}
                        type="LIST"
                      >
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={snapshot.isDragging ? "opacity-75" : ""}
                          >
                            <ListColumn
                              list={list}
                              listColors={listColors}
                              editingListId={editingListId}
                              editedListTitle={editedListTitle}
                              onStartListEdit={startEditingList}
                              onChangeListTitle={setEditedListTitle}
                              onSaveListTitle={saveListTitle}
                              onCancelListEdit={cancelListEdit}
                              addingTaskForListId={addingTaskForListId}
                              newTaskTitle={newTaskTitles[list.id] || ""}
                              addTaskLoading={addTaskLoading[list.id]}
                              onStartAddTask={setAddingTaskForListId}
                              onChangeTaskTitle={setTaskTitle}
                              onSubmitAddTask={submitAddTask}
                              onCancelAddTask={() => setAddingTaskForListId(null)}
                              editingTaskId={editingTaskId}
                              editedTaskTitle={editedTitle}
                              onStartTaskEdit={startEditingTask}
                              onChangeTaskTitleInline={setEditedTitle}
                              onSaveTaskTitle={saveTaskTitle}
                              onCancelTaskEdit={cancelTaskEdit}
                              onToggleTaskDone={toggleTaskDone}
                              onAskDeleteList={(e) => handleAskDeleteList(e, list)}
                              onAskDeleteTask={handleAskDeleteTask}
                              onOpenAssign={openAssignModal}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <AddListCard
                    adding={addingList}
                    value={newListTitle}
                    loading={addListLoading}
                    onStart={() => setAddingList(true)}
                    onChange={setNewListTitle}
                    onSubmit={submitAddList}
                    onCancel={() => {
                      setAddingList(false);
                      setNewListTitle("");
                    }}
                  />
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <ConfirmPopover
          position={confirmingDelete?.position}
          message={
            confirmingDelete?.type === "task"
              ? "Delete this task?"
              : "Delete this list?"
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmingDelete(null)}
        />

        {assigningTask && (
          <AssignModal
            task={assigningTask}
            members={members}
            onAssign={handleAssignUser}
            onUnassign={handleUnassignUser}
            onClose={closeAssignModal}
          />
        )}
      </div>
    </DragDropContext>
  );
}
