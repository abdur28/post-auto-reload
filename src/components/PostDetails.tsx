// PostDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className='post-detail'>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );
};

export default PostDetails;
