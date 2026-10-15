pipeline {
    agent any

    stages {
        stage('Setup Bun') {
            steps {
                sh '''
                    set -e
                    if ! command -v bun >/dev/null 2>&1; then
                        curl -fsSL https://bun.sh/install | bash
                    fi
                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"
                    bun --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"
                    bun install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"
                    bun run test
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"
                    bun run build
                '''
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
