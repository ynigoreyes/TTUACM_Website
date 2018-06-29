docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker push acmtexastech/acmttu-web:${TRAVIS_BRANCH}

# Deploy if on master branch
if [${TRAVIS_BRANCH} == "master"]
then
  curl http://acmttu.org:8080
fi