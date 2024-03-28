import React, { useEffect, useState } from 'react';
import Post from './Post'; // Импорт компонента Post
import styles from './Post.module.css'; // Импорт CSS-стилей для компонента

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
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false); // Состояние для отслеживания того, что больше нет постов

  // Функция для загрузки начальных постов
  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      const data = await response.json();
      const uniquePosts = data.filter((post: Post) => !fetchedPostIds.includes(post.id));
      if (uniquePosts.length === 0) {
        setNoMorePosts(true); // Установка значения noMorePosts в true, если больше нет уникальных постов
        return; // Выход из функции, если больше нет постов
      }
      setPosts(uniquePosts);
      setFetchedPostIds(data.map((post: Post) => post.id));
    } catch (error) {
      console.error('Ошибка при загрузке начальных постов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для загрузки дополнительных постов
  const fetchMorePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      const data = await response.json();
      const uniquePosts = data.filter((post: Post) => !fetchedPostIds.includes(post.id));
      if (uniquePosts.length === 0) {
        setNoMorePosts(true); // Установка значения noMorePosts в true, если больше нет уникальных постов
        return; // Выход из функции, если больше нет постов
      }
      setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
      setFetchedPostIds((prevIds) => [...prevIds, ...uniquePosts.map((post: Post) => post.id)]);
      if (autoLoadCount < 5) {
        setAutoLoadCount((count) => count + 1);
      }
    } catch (error) {
      console.error('Ошибка при загрузке дополнительных постов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка начальных постов при монтировании компонента
  useEffect(() => {
    fetchInitialPosts();
  }, []);

  // Обработка событий скролла и автоматическая загрузка дополнительных постов
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

  // Загрузка дополнительных постов при изменении страницы
  useEffect(() => {
    if (page > 1) {
      fetchMorePosts();
    } else {
      setNoMorePosts(false); // Сброс состояния noMorePosts при сбросе счетчика страниц
    }
  }, [page]);

  // Возвращаем JSX разметку компонента
  return (
    <div className={styles.postsList}>
      {/* Отображение каждого поста */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {/* Отображение сообщения о загрузке */}
      {loading && <p>Загрузка...</p>}
      {/* Условный рендеринг на основе состояния noMorePosts */}
      {!loading && !noMorePosts && (
        <button className={styles.loadMoreButton} id='load-more-button'>
          Загрузить еще
        </button>
      )}
      {/* Сообщение о том, что больше нет постов */}
      {!loading && noMorePosts && <button className={styles.loadMoreButton} disabled >
          Больше нет постов
        </button>}
    </div>
  );
};

export default PostsList; // Экспорт компонента
