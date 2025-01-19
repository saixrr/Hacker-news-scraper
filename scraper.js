const axios = require('axios');
const { format } = require('date-fns'); // Use date-fns for formatting



async function fetchStories(latestTimestamp) {
    try {
        const storyIdsResponse = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');
        const allStoryIds = storyIdsResponse.data;
        const latestTimestampInSeconds = Math.floor(Date.parse(latestTimestamp) / 1000);

        const storyPromises = allStoryIds.map(async (id) => {
            try {
                const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const storyData = storyResponse.data;
                

                // Only fetch stories with a timestamp greater than the latestTimestamp
                if (storyData.time > latestTimestampInSeconds) {
                    return {
                        id: storyData.id,
                        title: storyData.title || 'No title available',
                        url: storyData.url || 'No URL available',
                        time: storyData.time,
                    };
                    return("new story",storyData)
                }

                return null;
            } catch (error) {
                console.error(`Error fetching story with ID: ${id}`, error);
                return null;
            }
        });

        const stories = await Promise.allSettled(storyPromises);
        const newStories = stories
            .filter(story => story.status === 'fulfilled' && story.value)
            .map(story => story.value);

        return newStories;
    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
}

module.exports = fetchStories;
