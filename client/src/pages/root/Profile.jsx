import React, { useEffect, useState } from 'react'
import { getUserPosts, handlePostDelete } from '../../utils/fetchVolunteerData';
import toast from 'react-hot-toast';
import { useUserContext } from '../../context/AuthProvider';
import Card from '../../components/UI/Card';
import ConfirmationModal from '../../components/ConfirmationModal';

const Profile = () => {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUserContext()
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

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
      setConfirmDeleteModalOpen(false); // Close the modal after deletion
    }
  };

  const fetchData = async () => {
    const userPosts = await getUserPosts()
    setPosts(userPosts)
    setLoading(false)

  };

  useEffect(() => {

    fetchData();

  }, [])

  // console.log(posts);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.length ? (

          <section className='my-5'>

            <div className='flex flex-col items-center gap-3 my-6 justify-center'>

              <img src={user.avatar} className=' image--cover h-[100px] w-[100px] bg-black' />

              <div className='flex justify-center items-center flex-col'>
                <p>{user.fullName}</p>
                <p>@{user.username}</p>

              </div>

            </div>

            <div>
              {
                posts.map(post => (
                  <Card post={post} key={post._id} handleDelete={handleDelete} />
                ))
              }
            </div>

          </section>

        ) : (
          <p>You have no posts to show</p>
        )
      )}
      <ConfirmationModal
        isOpen={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        onConfirm={confirmDeletePost} />
    </>
  )
}

export default Profile