pipeline {
    agent any
    environment {
        NAME = 'small-tools-web'
        PROFILE = 'dev'
        APP = 'registry.cn-hangzhou.aliyuncs.com/zhengqing/small-tools-web:dev'
        APP_PORT = 80
    }

    stages {
        stage('下载代码') {
            steps {
                echo '****************************** download code start... ******************************'
                git branch: 'dev', credentialsId: 'xxxxxxxxxxxxxxxxx', url: 'https://gitee.com/zhengqingya/small-tools.git'
            }
        }

        stage('vue环境准备') {
            steps {
                echo '****************************** vue start... ******************************'
                sh 'pnpm install'
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