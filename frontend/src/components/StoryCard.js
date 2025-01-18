const StoryCard = ({ title, url, time }) => (
    <div className="story-card">
      <h3><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></h3>
      <p>{new Date(time).toLocaleString()}</p>
    </div>
  );
  
  export default StoryCard;
  