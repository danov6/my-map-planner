import React from 'react';
import { TRAVEL_TOPICS } from 'client/constants';

interface StaffPick {
  id: string;
  author: string;
  title: string;
  date: string;
  authorImage?: string;
}

interface HomePageRightNavbarProps {
  staffPicks: StaffPick[];
}

const HomePageRightNavbar: React.FC<HomePageRightNavbarProps> = ({ staffPicks }) => {
  return (
    <aside className="right-navbar">
      <div className="right-navbar-content">
        <section className="staff-picks">
          <h2>Gio's Picks</h2>
          {staffPicks.map((pick) => (
            <div key={pick.id} className="staff-pick-item">
              <div className="author-info">
                <img 
                  src={pick.authorImage || '/default-avatar.png'} 
                  alt={pick.author}
                  className="author-image"
                />
                <span>by {pick.author}</span>
              </div>
              <h3>{pick.title}</h3>
              <span className="date">{pick.date}</span>
            </div>
          ))}
          <button className="see-full-list">See the full list</button>
        </section>

        <section className="recommended-topics">
          <h2>Recommended topics</h2>
          <div className="topics-list">
            {TRAVEL_TOPICS.map((topic, index) => (
              <button key={index} className="topic-tag">
                {topic}
              </button>
            ))}
          </div>
          <button className="see-more-topics">See more topics</button>
        </section>
      </div>
    </aside>
  );
};

export default HomePageRightNavbar;