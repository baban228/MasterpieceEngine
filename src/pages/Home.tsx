import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-page__hero">
        <h1>Welcome to MultiDraw</h1>
        <p>Collaborate in real-time with your team using our interactive drawing boards</p>
        <Link to="/boards" className="home-page__cta-button">
          Get Started
        </Link>
      </div>
      
      <div className="home-page__features">
        <div className="feature">
          <h2>Real-time Collaboration</h2>
          <p>Draw and communicate with your team in real-time</p>
        </div>
        <div className="feature">
          <h2>Multiple Boards</h2>
          <p>Create and manage multiple drawing boards for different projects</p>
        </div>
        <div className="feature">
          <h2>Easy to Use</h2>
          <p>Intuitive interface with customizable drawing tools</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
