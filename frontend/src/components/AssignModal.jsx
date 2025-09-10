import React, { useState, useEffect } from "react";

export default function AssignModal({ task, members, onClose, onAssign, onUnassign }) {
  const [processingUserIds, setProcessingUserIds] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState(
    task.assignedUsers?.map(u => String(u.applicationUserId)) || []
  );

  // 🔹 Sync with prop if task changes (e.g. after refresh)
  useEffect(() => {
    setAssignedUserIds(task.assignedUsers?.map(u => String(u.applicationUserId)) || []);
  }, [task]);

  const handleToggleAssignment = async (member) => {
    const userId = String(member.applicationUserId);
    setProcessingUserIds(prev => [...prev, userId]);

    const isAssigned = assignedUserIds.includes(userId);

    try {
      if (isAssigned) {
        await onUnassign(task.id, userId);
        // Optimistically update local state
        setAssignedUserIds(prev => prev.filter(id => id !== userId));
      } else {
        await onAssign(task.id, userId);
        // Optimistically update local state
        setAssignedUserIds(prev => [...prev, userId]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update assignment");
    } finally {
      setProcessingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-4 w-80">
        <h3 className="text-lg font-semibold mb-3">Assign Members</h3>

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {[...members]
            .sort((a, b) => {
              // Compare first names
              const firstNameComparison = a.firstName.localeCompare(b.firstName);
              if (firstNameComparison !== 0) return firstNameComparison;
              // If first names are the same, compare last names
              return a.lastName.localeCompare(b.lastName);
            })
            .map(member => {
              const userId = String(member.applicationUserId);
              const assigned = assignedUserIds.includes(userId);
              const processing = processingUserIds.includes(userId);

              return (
                <li key={userId} className="flex justify-between items-center">
                  <span>{member.firstName} {member.lastName}</span>
                  <button
                    onClick={() => handleToggleAssignment(member)}
                    disabled={processing}
                    className={`px-2 py-1 rounded text-white ${
                      assigned ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"
                    } disabled:opacity-50`}
                  >
                    {processing ? (assigned ? "Removing…" : "Assigning…") : assigned ? "Remove" : "Assign"}
                  </button>
                </li>
              );
            })}
        </ul>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}






