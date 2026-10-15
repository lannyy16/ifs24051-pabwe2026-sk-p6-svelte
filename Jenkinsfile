pipeline {
    agent any

    stages {
        stage('Setup Bun') {
            steps {
                sh '''
                    set -eu

                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"

                    if ! command -v bun >/dev/null 2>&1; then
                        curl -fsSL https://bun.sh/install | bash -s "bun-v1.4.2"
                    fi

                    bun --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    set -eu

                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"

                    bun install --frozen-lockfile
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    set -eu

                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"

                    bun run test
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -eu

                    export BUN_INSTALL="$HOME/.bun"
                    export PATH="$BUN_INSTALL/bin:$PATH"

                    bun run build
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        set -eu
                        sonar-scanner
                    '''
                }
            }
        }
    }
}