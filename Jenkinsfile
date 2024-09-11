pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'echo Hello World'
      }
    }

    stage('Go to Craft') {
      steps {
        git(url: 'https://github.com/VenkatRaman3103/Projects/tree/main/craft', branch: 'main')
      }
    }

  }
}