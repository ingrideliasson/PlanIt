import React, { useState, useEffect } from "react";
import api from "../services/api";
import { RxCross1 } from "react-icons/rx";

export default function AddMembersModal({
  boardId,
  onClose,
  onMemberAdded,
  existingMembers, // BoardView members state
  currentUserId
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [processingUserIds, setProcessingUserIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Live search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/boards/${boardId}/users/search?username=${searchQuery}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, boardId]);

  // 🔹 Toggle membership
  const handleToggleMember = async (user) => {
    const userId = String(user.id); // Ensure consistent string
    const isMember = existingMembers.some(m => m.applicationUserId === userId);

    setProcessingUserIds(prev => [...prev, userId]);

    try {
      if (isMember) {
        // Remove user
        await api.delete(`/boards/${boardId}/users/${userId}`);
        console.log(userId);
        onMemberAdded({ applicationUserId: userId, removed: true });
      } else {
        // Add user
        const res = await api.post(`/boards/${boardId}/users`, { userId });
        // Ensure frontend state uses applicationUserId as string
        const addedMember = {
          applicationUserId: res.data.applicationUserId || String(res.data.userBoard?.ApplicationUserId) || userId,
          userName: res.data.userName,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          role: res.data.role || "Member",
          colorIndex: res.data.colorIndex?? 0
        };
        onMemberAdded(addedMember);
      }
    } catch (err) {
      console.error("Failed to toggle member:", err);
      alert(isMember ? "Failed to remove user" : "Failed to add user");
    } finally {
      setProcessingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-montserrat">
      <div className="bg-white rounded-lg p-6 w-128 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <RxCross1 />
        </button>

        <h2 className="text-lg mb-4 text-center">Handle Members</h2>

        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search name or email"
          className="w-full border rounded px-2 py-1 mb-4"
        />

        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {loading && <li className="text-gray-500">Searching...</li>}
          {!loading && searchResults.length === 0 && searchQuery.trim() && (
            <li className="text-gray-500">No users found</li>
          )}

          {searchResults.map(user => {
            const userId = String(user.id);
            const isMember = existingMembers.some(m => m.applicationUserId === userId);

            return (
              <li key={userId} className="flex justify-between items-center border-b pb-1 text-sm">
                <div>
                  <span className="mr-4">{`${user.firstName ?? ""} ${user.lastName ?? ""}`}</span>
                  <span className="text-gray-500 text-sm">{user.userName}</span>
                </div>

                {userId !== currentUserId && (
                  <button
                    disabled={processingUserIds.includes(userId)}
                    onClick={() => handleToggleMember(user)}
                    className={`px-2 py-1 rounded text-bla ml-2 ${
                      isMember ? "bg-neutral-200 hover:bg-neutral-300" : "bg-neutral-200 hover:bg-neutral-300"
                    } disabled:opacity-50`}
                  >
                    {processingUserIds.includes(userId)
                      ? isMember
                        ? "Removing…"
                        : "Adding…"
                      : isMember
                      ? "Remove"
                      : "Add"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

