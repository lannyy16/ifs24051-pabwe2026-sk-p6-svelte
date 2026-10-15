pipeline {
    agent any

    environment {
        BUN_INSTALL = "${HOME}/.bun"
        NODE_VERSION = "22.21.1"
    }

    stages {
        stage('Setup Tools') {
            steps {
                sh '''
                    set -eu

                    export PATH="$BUN_INSTALL/bin:$PATH"

                    echo "=== Setup Bun ==="
                    bun --version

                    echo "=== Setup Node.js ==="
                    NODE_DIR="$HOME/.local/node-v$NODE_VERSION"

                    if [ ! -x "$NODE_DIR/bin/node" ]; then
                        mkdir -p "$HOME/.local"

                        ARCH="$(uname -m)"
                        case "$ARCH" in
                            x86_64) NODE_ARCH="x64" ;;
                            aarch64|arm64) NODE_ARCH="arm64" ;;
                            *)
                                echo "Unsupported architecture: $ARCH"
                                exit 1
                                ;;
                        esac

                        TARBALL="node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"
                        URL="https://nodejs.org/dist/v${NODE_VERSION}/${TARBALL}"

                        curl -fsSL "$URL" -o "/tmp/$TARBALL"
                        mkdir -p "$NODE_DIR"
                        tar -xJf "/tmp/$TARBALL" \
                            --strip-components=1 \
                            -C "$NODE_DIR"
                        rm -f "/tmp/$TARBALL"
                    fi

                    echo "NODE_DIR=$NODE_DIR" > node-env.txt
                    export PATH="$NODE_DIR/bin:$PATH"

                    node --version
                    npm --version
                '''

                script {
                    def nodeDir = sh(
                        script: "cat node-env.txt",
                        returnStdout: true
                    ).trim().replace('NODE_DIR=', '')

                    env.NODE_DIR = nodeDir
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    set -eu
                    export PATH="$NODE_DIR/bin:$BUN_INSTALL/bin:$PATH"

                    bun install --frozen-lockfile
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    set -eu
                    export PATH="$NODE_DIR/bin:$PATH"

                    node ./node_modules/vitest/vitest.mjs run
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -eu
                    export PATH="$NODE_DIR/bin:$PATH"

                    node ./node_modules/vite/bin/vite.js build
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