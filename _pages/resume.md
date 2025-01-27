---
layout: page
title: Robert Pannick - Resume
permalink: /resume/
video:
  webm: "https://vjs.zencdn.net/v/oceans.webm"
  mp4: "https://vjs.zencdn.net/v/oceans.mp4"
---

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robert Pannick - Resume</title>
    <style>
        :root {
            --primary-color: #3498db;
            --text-color: #2c3e50;
            --background-color: #f9f9f9;
            --card-background: #ffffff;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .resume-container {
            background-color: var(--card-background);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 40px;
        }
        h1, h2 {
            color: var(--primary-color);
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            letter-spacing: -1px;
        }
        h2 {
            font-size: 1.5em;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 10px;
            margin-top: 30px;
        }
        .contact-info {
            font-size: 0.9em;
            color: #666;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        .contact-info span::before {
            content: '•';
            margin-right: 5px;
            color: var(--primary-color);
        }
        ul {
            padding-left: 0;
            list-style-type: none;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skills li {
            background-color: rgba(52, 152, 219, 0.1);
            color: var(--primary-color);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .job {
            margin-bottom: 20px;
        }
        .job-title {
            font-weight: bold;
            color: var(--primary-color);
        }
        .job-details {
            font-style: italic;
            font-size: 0.9em;
            color: #666;
        }
        .certifications li {
            margin-bottom: 5px;
        }
        .certifications li::before {
            content: '✓';
            color: var(--primary-color);
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <header>
            <h1>Robert Pannick</h1>
            <div class="contact-info">
                <span>github.com/b08x</span>
                <span>rwpannick@gmail.com</span>
                <span>Columbus, OH 43201</span>
                <span>+1 614 653 8241</span>
            </div>
        </header>

        <section>
            <h2>Summary</h2>
            <p>Experienced DevOps engineer and Linux systems administrator with expertise in shell scripting, containerization, virtualization, and configuration management. Passionate about open-source technology and audio production, with a keen interest in innovative problem-solving and collaborative environments.</p>
        </section>

        <section>
            <h2>Technical Skills</h2>
            <ul class="skills">
                <li>Linux Systems (Red Hat, Ubuntu, SUSE)</li>
                <li>Ansible</li>
                <li>Docker</li>
                <li>KVM</li>
                <li>Ruby</li>
                <li>Python</li>
                <li>Bash</li>
                <li>Audio Processing</li>
                <li>Web Development</li>
                <li>DevOps & IaC</li>
            </ul>
        </section>

        <section>
            <h2>Work Experience</h2>
            <div class="job">
                <p class="job-title">DevOps Engineer</p>
                <p class="job-details">FortyAU - Nashville, TN (August 2014 to November 2016)</p>
                <p>Implemented DevOps practices, CI/CD tools, and Ansible for configuration management, automating software development and deployment processes for Rails-based applications in a HA production environment.</p>
            </div>
            <div class="job">
                <p class="job-title">Linux Systems Administrator</p>
                <p class="job-details">OnShored Development, Chicago, IL (July 2012 - June 2014)</p>
                <p>Provided system administration and application support to clients, including installing, debugging, and optimizing applications across various Linux distributions.</p>
            </div>
        </section>

        <section>
            <h2>Certifications</h2>
            <ul class="certifications">
                <li>Red Hat Certified Engineer (2013)</li>
                <li>Red Hat Certified System Administrator (2013)</li>
            </ul>
        </section>
    </div>
</body>