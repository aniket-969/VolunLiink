import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPosts } from '../utils/fetchVolunteerData';
import Card from './UI/Card';

const PostDetails = () => {

  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState([])

  const { postId } = useParams()
  useEffect(() => {

    const fetchData = async () => {
      let filter = { postId: postId }
      const postData = await getPosts(1,5,filter);
      console.log(postData);
      setPost(postData)
      setLoading(false)

    };

    fetchData();

  }, [postId])

  console.log(postId);
  console.log(post);

  return (
    <section className='flex justify-center my-5'>
      {loading ? <p>Loading...</p> :

        <Card post={post[0]} />

      }</section>
  )
}

export default PostDetails