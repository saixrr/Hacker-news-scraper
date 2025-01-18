import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import { fetchStories } from '../services/api';

const StoryList = () => {
  const [stories, setStories] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const getStories = async () => {
      try {
        setLoading(true);
        const data = await fetchStories();
        setStories(data || []); // Ensure `data` is not null or undefined
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStories();
  }, []);

  if (loading) {
    return <p>Loading stories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stories.length) {
    return <p>No stories available.</p>;
  }

  return (
    <div className="story-list">
      {stories.map((story, index) => (
        <StoryCard key={index} {...story} />
      ))}
    </div>
  );
};

export default StoryList;
