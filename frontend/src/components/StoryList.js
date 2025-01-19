import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';

const StoryList = () => {
  const [stories, setStories] = useState([]); // Store fetched stories
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  console.log(stories)

  useEffect(() => {
    let socket;

    const setupWebSocket = () => {
      // Initialize WebSocket connection
      socket = new WebSocket('ws://127.0.0.1:5002');


      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        // Handle initial stories
        if (message.type === 'INITIAL_STORIES') {
          setStories(message.stories); // Set initial stories
        }
        
        // Handle new stories
        if (message.type === 'NEW_STORIES') {
          console.log(...message.stories);
      
          setStories((prevStories) => {
            // Create a set of existing story IDs to check for duplicates
            const existingStoryIds = new Set(prevStories.map(story => story.id));
      
            // Filter out new stories that are already in the existing list
            const uniqueNewStories = message.stories.filter((story) => !existingStoryIds.has(story.id));
      
            // Prepend the unique new stories to the previous stories
            return [...uniqueNewStories, ...prevStories];
          }); // Prepend new stories
        }
      };
      console.log(stories)

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
