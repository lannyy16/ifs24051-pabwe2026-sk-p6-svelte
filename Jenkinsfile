
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
                bat 'bun install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'bun run test'
            }
        }

        stage('Build') {
            steps {
                bat 'bun run build'
            }
        }
    }
}
