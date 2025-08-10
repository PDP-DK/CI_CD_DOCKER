pipeline{
    agent any

    environment{
        IMAGE_NAME = "ci_cd_docker"
        USER_NAME = "krish282"
    }

    stages{
        stage('Clone'){
            steps{
                git branch:'main', url:'https://github.com/PDP-DK/CI_CD_DOCKER.git'
            }
        }

        stage('Test'){
            steps{
                sh 'npm run test || true'
            }
        }

        stage('Remove image'){
            steps{
                sh 'docker rmi $USER_NAME/$IMAGE_NAME --force || true'
            }
        }

        stage('Image Build'){
            steps{
                sh 'docker build -t $USER_NAME/$IMAGE_NAME .'
            }
        }
        

    }

}