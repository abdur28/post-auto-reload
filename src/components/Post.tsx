import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Post.module.css';

interface PostProps {
  post: {
    id: number;
    title: string;
    body: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    // Обертка для поста
    <div className={styles.post}>
      {/* Ссылка на страницу с деталями поста */}
      <Link to={`/post/${post.id}`}>
        <div className="card">
          <div className="content">
            <p className="heading">{post.title}</p>
            <p className="para">
              {post.body}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Post;
