pipeline {
  agent any
  tools { nodejs 'node22' }   // nama sesuai Global Tool Configuration
  stages {
    stage('Test') {
      steps {
        sh '''
          export BUN_INSTALL=/var/jenkins_home/.bun
          export PATH=$BUN_INSTALL/bin:$PATH
          which node && node -v
          bun install
          bun run test
        '''
      }
    }
  }
}