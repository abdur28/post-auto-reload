import React, { useEffect, useState } from 'react';
import Post from './Post';
import styles from './Post.module.css';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [fetchedPostIds, setFetchedPostIds] = useState<number[]>([]);
  const [autoLoadCount, setAutoLoadCount] = useState<number>(0);

  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`
      );
      const data = await response.json();
      const uniquePosts = data.filter((post: Post) => !fetchedPostIds.includes(post.id));
      setPosts(uniquePosts);
      setFetchedPostIds(data.map((post: Post) => post.id));
    } catch (error) {
      console.error('Error fetching initial posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`
      );
      const data = await response.json();
      const uniquePosts = data.filter((post: Post) => !fetchedPostIds.includes(post.id));
      setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
      setFetchedPostIds((prevIds) => [...prevIds, ...uniquePosts.map((post: Post) => post.id)]);
      if (autoLoadCount < 5) {
        setAutoLoadCount((count) => count + 1);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    fetchInitialPosts();
  }, []);

  useEffect(() => {
    const handleLoadMore = () => {
      setPage((prevPage) => prevPage + 1);
    };
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const body = document.body;
      const documentHeight = body.offsetHeight;
      const windowBottom = windowHeight + window.pageYOffset;

      if (windowBottom >= documentHeight - 1 && !loading && autoLoadCount < 5) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const button = document.getElementById('load-more-button');
    if (button) {
      button.addEventListener('click', handleLoadMore);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (button) {
        button.removeEventListener('click', handleLoadMore);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, autoLoadCount]);



  useEffect(() => {
    if (page > 1) {
      fetchMorePosts();
    } else {

    }
  }, [page]);

  return (
    <div className={styles.postsList}>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <p>Loading...</p>}
      {!loading && (
        <button className={styles.loadMoreButton} id='load-more-button'>
          Load More
        </button>
      )}
    </div>
  );
};

export default PostsList;
