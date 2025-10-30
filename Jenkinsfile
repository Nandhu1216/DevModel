pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Nandhu1216/DevModel.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("devmodel-app")
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    // Stop and remove old container if exists
                    sh 'docker stop devmodel-container || true'
                    sh 'docker rm devmodel-container || true'
                    
                    // Run new container
                    sh 'docker run -d -p 3000:3000 --name devmodel-container devmodel-app'
                }
            }
        }
    }
}
