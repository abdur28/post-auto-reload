import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails: React.FC = () => {
  // Получаем параметр postId из URL
  const { postId } = useParams<{ postId: string }>();
  // Состояние для хранения данных о посте
  const [post, setPost] = useState<any>({});

  // Загрузка данных о посте при монтировании компонента
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Запрос к API для получения данных о посте
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const data = await response.json();
        // Обновляем состояние с полученными данными о посте
        setPost(data);
      } catch (error) {
        // Обработка ошибки при загрузке данных о посте
        console.error('Ошибка при загрузке данных о посте:', error);
      }
    };

    // Вызываем функцию для загрузки данных о посте
    fetchPost();
  }, [postId]); // Зависимость от изменения параметра postId

  return (
    <div className='post-detail'>
      {/* Выводим заголовок поста */}
      <h2>{post.title}</h2>
      {/* Выводим текст поста */}
      <p>{post.body}</p>
    </div>
  );
};

export default PostDetails;
