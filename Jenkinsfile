pipeline {
    agent any
    environment {
        NAME = 'small-tools-web'
        PROFILE = 'dev'
        APP = 'registry.cn-hangzhou.aliyuncs.com/zhengqing/small-tools-web:dev'
        APP_PORT = 80
    }

    stages {
        stage("检出") {
      steps {
        checkout(
          [$class: 'GitSCM',
          branches: [[name: GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: GIT_REPO_URL,
              credentialsId: CREDENTIALS_ID
            ]]]
        )
      }
    }

        stage('vue环境准备') {
            steps {
                echo '****************************** vue start... ******************************'
                sh 'pwd'
                sh 'pnpm i'
                sh 'pnpm build'
            }
        }

        stage('构建Docker镜像') {
            steps {
                echo '****************************** delete container and image... ******************************'
                sh 'docker ps -a|grep $NAME|awk \'{print $1}\'|xargs -i docker stop {}|xargs -i docker rm {}'
                sh 'docker images|grep $NAME|grep dev|awk \'{print $3}\'|xargs -i docker rmi {}'

                echo '****************************** build image... ******************************'
                sh 'docker build --build-arg PROFILE=dev -t $APP .'
            }
        }

        stage('运行容器') {
            steps {
                echo '****************************** run start... ******************************'
                sh 'docker run -d -p $APP_PORT:80 --restart=always --name $NAME $APP'
            }
        }
    }
}