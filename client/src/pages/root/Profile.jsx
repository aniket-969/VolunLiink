import React, { useEffect, useState } from "react";
import {
  getUserPosts,
  handlePostDelete,
  updateUserProfile,
} from "../../utils/fetchVolunteerData";
import toast from "react-hot-toast";
import { useUserContext } from "../../context/AuthProvider";
import Card from "../../components/UI/Card";
import ConfirmationModal from "../../components/ConfirmationModal";
import {  FaCameraRetro } from "react-icons/fa6";
import {AiOutlineLoading} from "react-icons/ai"
import ProfileImageUpload from "../../components/ProfileImageUpload";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUserContext();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState(user.fullName);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(null);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    if (!editedFullName || !editedFullName) {
      toast.error("Field can't be empty");
      return;
    }

    const hasChanges =
      editedFullName !== user.fullName || editedUsername !== user.username;
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }
    const updatedUser = {
      fullName: editedFullName,
      username: editedUsername,
    };
    const userResponse = await updateUserProfile(updatedUser);
    console.log(userResponse);
    updateUser(userResponse);
    setIsEditing(false);
    toast.success("Profile Updated");
  };

  const handleDelete = (postId) => {
    setPostIdToDelete(postId);
    setConfirmDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (postIdToDelete) {
      const data = await handlePostDelete(postIdToDelete);
      console.log(data.message);
      toast.success(data.message);
      fetchData();
      setConfirmDeleteModalOpen(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate the file as per your requirements (size, type, etc.)
      const formData = new FormData();
      formData.append("avatar", file);

      const updatedUser = await updateUserAvatar(formData);
      updateUser(updatedUser);
      toast.success("Avatar updated successfully!");

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

  // console.log(posts);

  return (
    <>
      <section className="my-5 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 my-6 justify-center ">
         
         <ProfileImageUpload user ={user}  onUpload={handleAvatarChange}/>
          <div className="flex justify-center items-center flex-col">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedFullName}
                  onChange={(e) => setEditedFullName(e.target.value)}
                  className="border rounded p-1"
                />
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="border rounded p-1"
                />
              </>
            ) : (
              <>
                <p>{user.fullName}</p>
                <p>@{user.username}</p>
              </>
            )}
            {isEditing ? (
              <div>
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-green-500 text-white p-2 rounded"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : posts.length ? (
          <div className="flex flex-col gap-2  md:max-w-[710px]">
            {posts.map((post) => (
              <Card post={post} key={post._id} handleDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <p>You have no posts to show</p>
        )}
      </section>
      <ConfirmationModal
        isOpen={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        onConfirm={confirmDeletePost}
      />
    </>
  );
};

export default Profile;
