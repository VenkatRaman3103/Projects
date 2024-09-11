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
        git(url: 'https://github.com/VenkatRaman3103/Projects', branch: 'main')
        dir('craft') {  
          sh 'echo Inside Craft project'
        }
      }
    }

  }
}
