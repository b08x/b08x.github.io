---
layout: default
title: "Video Tutorial - NPM Package Installation"
description: "Interactive screencast walkthrough for troubleshooting npm package installation"
permalink: /video-tutorial-example/
---

# Interactive Video Tutorial

This page demonstrates the new **VideoPlayer** component with AI-generated timecoded captions for screencast walkthroughs.

<div data-island="VideoPlayer" data-props='{
  "title": "Troubleshooting NPM Package Installation",
  "videoUrl": "/assets/videos/npm-tutorial.mp4",
  "segments": [
    {
      "id": "intro",
      "title": "Introduction",
      "startTime": 0,
      "endTime": 45,
      "actions": [
        { "timestamp": 0, "description": "Welcome screen shown" },
        { "timestamp": 10, "description": "Prerequisites listed: Node.js 16+, npm 8+" },
        { "timestamp": 25, "description": "Overview of common npm installation issues" }
      ]
    },
    {
      "id": "setup",
      "title": "Environment Setup",
      "startTime": 45,
      "endTime": 125,
      "actions": [
        { "timestamp": 45, "description": "Open terminal window" },
        { "timestamp": 52, "description": "Navigate to project directory: cd ~/projects/my-app" },
        { "timestamp": 65, "description": "Check Node.js version: node --version" },
        { "timestamp": 78, "description": "Verify npm installation: npm --version" },
        { "timestamp": 95, "description": "Initialize package.json if needed" }
      ]
    },
    {
      "id": "problem",
      "title": "Problem Identification",
      "startTime": 125,
      "endTime": 210,
      "actions": [
        { "timestamp": 125, "description": "Attempt package installation: npm install express" },
        { "timestamp": 140, "description": "Error appears: EACCES permission denied" },
        { "timestamp": 155, "description": "Check npm cache location: npm config get cache" },
        { "timestamp": 175, "description": "Verify file permissions: ls -la node_modules/" },
        { "timestamp": 195, "description": "Identify ownership issue with sudo installation" }
      ]
    },
    {
      "id": "solution",
      "title": "Solution Implementation",
      "startTime": 210,
      "endTime": 340,
      "actions": [
        { "timestamp": 210, "description": "Change npm global directory ownership" },
        { "timestamp": 225, "description": "Run: sudo chown -R $USER ~/.npm" },
        { "timestamp": 245, "description": "Clear npm cache: npm cache clean --force" },
        { "timestamp": 265, "description": "Remove node_modules: rm -rf node_modules" },
        { "timestamp": 285, "description": "Remove package-lock.json: rm package-lock.json" },
        { "timestamp": 305, "description": "Reinstall packages: npm install" },
        { "timestamp": 325, "description": "Installation succeeds without errors" }
      ]
    },
    {
      "id": "verify",
      "title": "Verification",
      "startTime": 340,
      "endTime": 420,
      "actions": [
        { "timestamp": 340, "description": "Check node_modules directory created" },
        { "timestamp": 355, "description": "Verify package.json updated with dependencies" },
        { "timestamp": 375, "description": "Test require statement: node -e \"require(&apos;express&apos;)\"" },
        { "timestamp": 395, "description": "Run simple test server" },
        { "timestamp": 410, "description": "Confirm installation successful" }
      ]
    }
  ],
  "transcript": [
    { "timestamp": 0, "text": "Welcome to this tutorial on troubleshooting npm package installation issues." },
    { "timestamp": 10, "text": "Before we begin, make sure you have Node.js version 16 or higher and npm version 8 or higher installed." },
    { "timestamp": 25, "text": "In this video, we&apos;ll cover the most common npm installation errors and how to fix them." },
    { "timestamp": 45, "text": "Let&apos;s start by opening a terminal window." },
    { "timestamp": 52, "text": "First, navigate to your project directory using the cd command." },
    { "timestamp": 65, "text": "Check your Node.js version by running node dash dash version." },
    { "timestamp": 78, "text": "Now verify npm is installed with npm dash dash version." },
    { "timestamp": 125, "text": "Let&apos;s try installing Express to demonstrate the issue. Type npm install express." },
    { "timestamp": 140, "text": "Notice the error message EACCES permission denied. This is a common issue." },
    { "timestamp": 155, "text": "Let&apos;s check where npm stores its cache with npm config get cache." },
    { "timestamp": 175, "text": "Looking at the node_modules directory permissions, we can see the problem." },
    { "timestamp": 195, "text": "The issue is that the global npm directory was installed with sudo, causing ownership problems." },
    { "timestamp": 210, "text": "To fix this, we need to change the ownership of the npm global directory." },
    { "timestamp": 225, "text": "Run sudo chown dash R dollar sign USER tilde slash dot npm." },
    { "timestamp": 245, "text": "Next, clear the npm cache with npm cache clean dash dash force." },
    { "timestamp": 265, "text": "Remove the existing node_modules directory." },
    { "timestamp": 285, "text": "Also delete the package-lock.json file to start fresh." },
    { "timestamp": 305, "text": "Now run npm install again." },
    { "timestamp": 325, "text": "Great! The installation completed successfully without any errors." },
    { "timestamp": 340, "text": "Let&apos;s verify everything is working correctly." },
    { "timestamp": 355, "text": "Check that the package.json file was updated with the new dependencies." },
    { "timestamp": 375, "text": "Test that we can require the Express module." },
    { "timestamp": 395, "text": "Run a simple test server to confirm everything works." },
    { "timestamp": 410, "text": "Perfect! The installation is now complete and verified." }
  ]
}'>
  <!-- VideoPlayer component will mount here -->
  <div style="padding: 2rem; text-align: center; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md);">
    <p style="color: var(--text-secondary);">Loading video player...</p>
    <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-top: 0.5rem;">
      If this message persists, JavaScript may be disabled or the component failed to load.
    </p>
  </div>
</div>

## About This Tutorial

This interactive video player features:

- **Synchronized Timeline**: The video automatically tracks which segment and action you're currently viewing
- **Actionable Steps**: Click any step to jump directly to that moment in the video
- **Progress Indicators**: Visual checkmarks show completed steps as you progress through the tutorial
- **Playback Controls**: Adjust video speed from 0.5x to 2x for your learning pace
- **Searchable Transcript**: Full transcript with timestamp navigation and search functionality
- **Responsive Design**: Works seamlessly on desktop and adapts to your theme settings

## How to Use

1. **Play the video** to see the synchronized action tracking
2. **Click on any step** in the "Actionable Steps" panel to jump to that moment
3. **Use playback speed controls** to watch at your preferred pace
4. **Search the transcript** to find specific topics or commands
5. **Click transcript timestamps** to navigate to specific discussions

## Technical Implementation

This component is built with:

- React with TypeScript for type safety
- CSS custom properties for seamless theme integration
- HTML5 video API for playback control
- Automatic segment detection based on video timeline
- Real-time progress tracking and synchronization

---

**Note**: This is a demonstration page. Replace the `videoUrl` with your actual video file path and customize the segments and transcript based on your AI-generated analysis.
