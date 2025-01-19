import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


  useEffect(() => {
    let socket;
    const setupWebSocket = () => {
      socket = new WebSocket('ws://127.0.0.1:5002');    // Initialize WebSocket connection
      socket.onopen = () => {
        console.log('WebSocket connected');
      };
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'INITIAL_STORIES') {
          setStories(message.stories);
        }
        
        // Handle new stories
        if (message.type === 'NEW_STORIES') {
          console.log(...message.stories);
      
          setStories((prevStories) => {
            const existingStoryIds = new Set(prevStories.map(story => story.id));
            const uniqueNewStories = message.stories.filter((story) => !existingStoryIds.has(story.id));
            return [...uniqueNewStories, ...prevStories];
          }); //prepend new stories
        }
      };
  
      socket.onerror = (err) => {
        console.error('WebSocket error:', err); 
      };

      socket.onclose = () => {
        console.log('WebSocket closed. Reconnecting in 5 seconds...');
        setTimeout(setupWebSocket, 5000); // Attempt to reconnect after 5 seconds
      };
    };

    setupWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  if (!stories.length) {
    return <p>No stories available.</p>;
  }

  if (loading && !stories.length) {
    return <p>Loading stories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
