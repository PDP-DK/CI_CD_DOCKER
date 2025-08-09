# Simple CI/CD Project with Jenkins & Docker

A basic setup showing how to automatically build and deploy a Node.js app using Jenkins, Docker, and GitHub.

## What This Does

- When you push code to GitHub → Jenkins automatically builds and runs your app
- Everything runs in Docker containers on AWS
- No manual work needed after setup!

## Tech Stack

- **Node.js** - The app
- **Docker** - Runs the app in containers
- **Jenkins** - Automates everything
- **GitHub** - Stores your code
- **AWS EC2** - Where it all runs

## The Magic Script

This runs in Jenkins whenever you push code:

```bash
docker rm krish --force
docker rmi $(docker images -q | head -n 1)
docker build -t krish282/ci_cd_docker .
docker run -d --name krish -p 5173:5173 krish282/ci_cd_docker
```

## What Each Line Does

1. `docker rm krish --force` - Removes old container
2. `docker rmi $(docker images -q | head -n 1)` - Removes old image
3. `docker build -t krish282/ci_cd_docker .` - Builds new image
4. `docker run -d --name krish -p 5173:5173 krish282/ci_cd_docker` - Runs new container

## How It Works

1. You push code to GitHub
2. GitHub tells Jenkins "Hey, new code!"
3. Jenkins runs the script above
4. Your app is live at `http://your-server:5173`

## Quick Setup

1. **AWS EC2**: Install Docker and Jenkins
2. **Jenkins**: Create job, add the script above
3. **GitHub**: Add webhook to your repo pointing to Jenkins
4. **Done!** Push code and watch it deploy automatically

## Files You Need

- `Dockerfile` - Tells Docker how to build your app
- `package.json` - Your Node.js app details
- Your app code

## Access Your App

After setup, visit: `http://your-ec2-ip:5173`

## That's It!

Push code → Jenkins builds → App updates automatically. Simple as that! 🚀

---

**Tip**: Replace `your-ec2-ip` with your actual server IP address.