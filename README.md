# CI/CD Pipeline with Jenkins, Docker and React

This project demonstrates a fully automated CI/CD pipeline using Jenkins, Docker, and GitHub to deploy a React application.

When code is pushed to GitHub, Jenkins will run tests, build a Docker image, deploy the container, and push the image to Docker Hub automatically.

---

## Workflow
<img width="1192" height="343" alt="image" src="https://github.com/user-attachments/assets/1fe7610f-7789-4602-83ac-2008337278f3" />
1. Code is pushed to GitHub, triggering a webhook to Jenkins.
2. Jenkins runs the pipeline:
   - Clones the repository.
   - Runs project tests.
   - Removes the old Docker image.
   - Builds a new Docker image.
   - Stops and removes the old container.
   - Runs the new container.
   - Pushes the image to Docker Hub.

---

## Technologies Used

- React.js – Frontend application  
- Node.js – Runtime environment  
- Docker – Containerization  
- Jenkins – CI/CD automation  
- GitHub – Source code management  
- AWS EC2 – Hosting environment  

---

## Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        IMAGE_NAME = "ci_cd_docker"
        USER_NAME = "krish282"
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/PDP-DK/CI_CD_DOCKER.git'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test || true'
            }
        }

        stage('Remove image') {
            steps {
                sh 'docker rmi $USER_NAME/$IMAGE_NAME --force || true'
            }
        }

        stage('Image Build') {
            steps {
                sh 'docker build -t $USER_NAME/$IMAGE_NAME .'
            }
        }

        stage('Container run') {
            steps {
                sh """
                    docker stop krish || true
                    docker rm krish || true
                    docker run -d --name krish -p 5173:5173 $USER_NAME/$IMAGE_NAME
                """
            }
        }

        stage('Push image') {
            steps {
                sh 'docker push $USER_NAME/$IMAGE_NAME'
            }
        }
    }
}
```

---

## Stage Descriptions

1. **Clone** – Pulls the latest code from GitHub.  
2. **Test** – Runs any available project tests (pipeline continues even if tests fail).  
3. **Remove image** – Deletes any existing Docker image for a clean build.  
4. **Image Build** – Creates a new Docker image from the application code.  
5. **Container run** – Stops and removes the existing container, then runs the new one.  
6. **Push image** – Uploads the latest image to Docker Hub.

---

## Example Deployment Commands

```bash
# Stop and remove old container
docker stop krish || true
docker rm krish || true

# Remove old image
docker rmi krish282/ci_cd_docker --force || true

# Build new image
docker build -t krish282/ci_cd_docker .

# Run new container
docker run -d --name krish -p 5173:5173 krish282/ci_cd_docker

# Push image to Docker Hub
docker push krish282/ci_cd_docker
```

---

## Setup Instructions

### 1. Configure AWS EC2
```bash
sudo apt update && sudo apt install docker.io -y
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Jenkins
sudo apt install openjdk-17-jdk -y
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update && sudo apt install jenkins -y
```

---

### 2. Configure Jenkins
- Create a new Pipeline job.
- Add the Jenkinsfile from above.
- Set up a GitHub webhook for automatic builds.

---

### 3. Configure GitHub
- In your repository, go to **Settings → Webhooks**.
- Add a new webhook with the URL:
```
http://<EC2-IP>:8080/github-webhook/
```

---

## Accessing the Application
Once the pipeline has run successfully, you can access the React app in your browser at:
```
http://<EC2-IP>:5173
```
<img width="1396" height="842" alt="image" src="https://github.com/user-attachments/assets/73089e34-fee4-477e-8508-1fe252b89198" />

---

This setup ensures that every code push is automatically tested, built, deployed, and published as a Docker image without manual intervention.
