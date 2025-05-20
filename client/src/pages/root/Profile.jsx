import React, { useEffect, useState } from "react";
import {
  updateUserProfile,
} from "../../api/queries/user";
import { deleteUserPost, getUserPosts } from "../../api/queries/volunteerPost";
import toast from "react-hot-toast";
import { useUserContext } from "../../context/AuthProvider";
import Card from "../../components/UI/Card";
import ConfirmationModal from "../../components/ConfirmationModal";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { FaEdit, FaKey } from "react-icons/fa";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUserContext();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState(user.fullName);
  const [editedUsername, setEditedUsername] = useState(user.username);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    if (!editedFullName.trim() || !editedUsername.trim()) {
      toast.error("Fields can't be empty");
      return;
    }

    const hasChanges =
      editedFullName !== user.fullName || editedUsername !== user.username;
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      const updated = await updateUserProfile({
        fullName: editedFullName,
        username: editedUsername,
      });
      updateUser(updated);
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = (postId) => {
    setPostIdToDelete(postId);
    setConfirmDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postIdToDelete) return;
    try {
      const res = await deleteUserPost(postIdToDelete);
      toast.success(res.message);
      fetchData();
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setConfirmDeleteModalOpen(false);
    }
  };

  const fetchData = async () => {
    const userPosts = await getUserPosts();
    setPosts(userPosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="my-6 max-w-2xl mx-auto px-4">
      <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
        <ProfileImageUpload user={user} updateUser={updateUser} />
        <div className="mt-4 flex items-start space-x-6 w-full">
          {/* User Info & Actions */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedFullName}
                  onChange={(e) => setEditedFullName(e.target.value)}
                  className="w-full border p-2 rounded focus:outline-none"
                />
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="w-full border p-2 rounded focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            )}
            <div className="mt-3 flex items-center space-x-4">
              {isEditing ? (
                <>  
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>                  
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-1 text-blue-600 text-sm hover:underline"
                  >
                    <FaEdit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="flex items-center space-x-1 text-red-600 text-sm hover:underline"
                  >
                    <FaKey size={16} />
                    <span>Change Password</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Posts List */}
      <section className="mt-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post._id}
                post={post}
                handleDelete={() => handleDelete(post._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            You have no posts to show.
          </p>
        )}
      </section>

      {/* Modals */}
      <ConfirmationModal
        isOpen={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        onConfirm={confirmDeletePost}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </section>
  );
};

export default Profile;
