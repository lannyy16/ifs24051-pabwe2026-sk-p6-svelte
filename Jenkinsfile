
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'bun install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'bun run test'
            }
        }

        stage('Build') {
            steps {
                sh 'bun run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }
    }
}
