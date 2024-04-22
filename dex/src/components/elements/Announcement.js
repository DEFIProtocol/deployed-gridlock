import React, { useState } from 'react';

function Announcement(props) {
  const { announcements } = props;
  const [showAll, setShowAll] = useState(false);
  console.log(announcements)
  const visibleAnnouncements = showAll ? announcements : announcements.slice(0, 3);

  return (
    <div>
      {visibleAnnouncements.map((announcement, index) => (
        <div key={index}>
          <h2>{announcement.title}</h2>
          <p>{announcement.description}</p>
          {/* Add more details as needed */}
        </div>
      ))}
      {!showAll && announcements.length > 3 && (
        <button onClick={() => setShowAll(true)}>Show More</button>
      )}
    </div>
  );
}

export default Announcement