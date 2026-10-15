pipeline {
    agent any

    environment {
        BUN_INSTALL = "${HOME}/.bun"
        NODE_VERSION = "22.21.1"
        SCANNER_VERSION = "7.2.0.5079"
    }

    stages {
        stage('Setup Tools') {
            steps {
                sh '''
                    set -eu

                    echo "================================"
                    echo "SETUP BUN"
                    echo "================================"

                    export PATH="$BUN_INSTALL/bin:$PATH"

                    if ! command -v bun >/dev/null 2>&1; then
                        curl -fsSL https://bun.sh/install | bash
                    fi

                    echo "Bun version:"
                    bun --version

                    echo "================================"
                    echo "SETUP NODE.JS"
                    echo "================================"

                    NODE_DIR="$HOME/.local/node-v$NODE_VERSION"

                    if [ ! -x "$NODE_DIR/bin/node" ]; then
                        mkdir -p "$HOME/.local"

                        ARCH="$(uname -m)"

                        case "$ARCH" in
                            x86_64)
                                NODE_ARCH="x64"
                                ;;
                            aarch64|arm64)
                                NODE_ARCH="arm64"
                                ;;
                            *)
                                echo "Unsupported architecture: $ARCH"
                                exit 1
                                ;;
                        esac

                        TARBALL="node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"

                        curl -fsSL \
                            "https://nodejs.org/dist/v${NODE_VERSION}/${TARBALL}" \
                            -o "/tmp/$TARBALL"

                        mkdir -p "$NODE_DIR"

                        tar -xJf "/tmp/$TARBALL" \
                            --strip-components=1 \
                            -C "$NODE_DIR"

                        rm -f "/tmp/$TARBALL"
                    fi

                    export PATH="$NODE_DIR/bin:$PATH"

                    node --version
                    npm --version

                    echo "NODE_DIR=$NODE_DIR" > node-env.txt
                '''

                script {
                    env.NODE_DIR = sh(
                        script: "sed -n 's/^NODE_DIR=//p' node-env.txt",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    set -eu

                    export PATH="$NODE_DIR/bin:$BUN_INSTALL/bin:$PATH"

                    echo "Installing project dependencies..."

                    bun install --frozen-lockfile

                    echo "Dependencies installed successfully."
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    set -eu

                    export PATH="$NODE_DIR/bin:$PATH"

                    echo "================================"
                    echo "RUNNING VITEST"
                    echo "================================"

                    node ./node_modules/vitest/vitest.mjs run
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -eu

                    export PATH="$NODE_DIR/bin:$PATH"

                    echo "================================"
                    echo "BUILDING SVELTE APPLICATION"
                    echo "================================"

                    node ./node_modules/vite/bin/vite.js build

                    echo "Build completed successfully."
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        set -eu

                        echo "================================"
                        echo "SETUP SONARSCANNER"
                        echo "================================"

                        SCANNER_HOME="$HOME/.local/sonar-scanner"
                        SCANNER_DIR="$SCANNER_HOME/sonar-scanner-${SCANNER_VERSION}-linux-x64"
                        SCANNER_ZIP="/tmp/sonar-scanner.zip"

                        if [ ! -x "$SCANNER_DIR/bin/sonar-scanner" ]; then
                            mkdir -p "$SCANNER_HOME"

                            curl -fsSL \
                                "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SCANNER_VERSION}-linux-x64.zip" \
                                -o "$SCANNER_ZIP"

                            if ! command -v unzip >/dev/null 2>&1; then
                                echo "ERROR: unzip is not installed on Jenkins."
                                exit 1
                            fi

                            unzip -q -o "$SCANNER_ZIP" -d "$SCANNER_HOME"

                            rm -f "$SCANNER_ZIP"
                        fi

                        export PATH="$SCANNER_DIR/bin:$PATH"

                        sonar-scanner --version

                        echo "================================"
                        echo "RUNNING SONARQUBE ANALYSIS"
                        echo "================================"

                        sonar-scanner
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Semua stage pipeline berhasil.'
        }

        failure {
            echo 'FAILED: Periksa Console Output pada stage yang gagal.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}