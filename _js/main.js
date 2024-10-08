import React from 'react';
import ReactDOM from 'react-dom';
import FlowbotsLearningDashboard from './FlowbotsLearningDashboard';

document.addEventListener('DOMContentLoaded', () => {
  const dashboardContainer = document.getElementById('flowbots-dashboard');
  if (dashboardContainer) {
    ReactDOM.render(<FlowbotsLearningDashboard />, dashboardContainer);
  }
});
