const axios = require('axios');
const cheerio = require('cheerio');

async function fetchStories() {
    try {
        // Fetch the IDs of top stories
        const storyIds = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');
        const topStoryIds = storyIds.data.slice(0, 10); // Limit to top 10 stories for efficiency

        // Fetch details for each story
        const storyPromises = topStoryIds.map(async (id) => {
            const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            console.log(story)
            return {
                title: story.data.title,
                url: story.data.url,
            };
        });

        // Wait for all story details to resolve
        const stories = await Promise.all(storyPromises);
        return stories;
    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
}

module.exports = fetchStories;
