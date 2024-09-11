pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'echo Hello World'
      }
    }

    stage('Clone Repository and Navigate to Craft') {
      steps {
        withCredentials(bindings: [string(credentialsId: 'github-pat', variable: 'GITHUB_TOKEN')]) {
          git(url: 'https://VenkatRaman3103:${GITHUB_TOKEN}@github.com/VenkatRaman3103/Projects.git', branch: 'main')
          dir(path: 'craft') {
            sh 'echo Inside Craft project'
          }

        }

      }
    }

  }
}