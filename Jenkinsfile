pipeline {
  agent any

  environment {
    VERCEL_TOKEN = credentials('vercel-token')
  }

  stages {

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Next.js App') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Run TypeORM Migration') {
      steps {
        sh 'npm run typeorm migration:run'
      }
    }

    stage('Deploy to Vercel') {
      steps {
        sh '''
        vercel pull --yes --environment=production --token=$VERCEL_TOKEN
        vercel build --prod --token=$VERCEL_TOKEN
        vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
        '''
      }
    }

  }
}