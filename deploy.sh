if [[ ${REJECT_DEPLOY} == true ]]
then
  echo "REJECT_DEPLOY is true and will not build container"
else
  docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
  echo $TRAVIS_BRANCH
  # Deploy if on master branch
  if [ ${TRAVIS_BRANCH} = "master" ]
  then
    docker build -t acmtexastech/acmttu-web:latest .
    docker push acmtexastech/acmttu-web:latest
  else
    docker build -t acmtexastech/acmttu-web:${TRAVIS_BRANCH} .
    docker push acmtexastech/acmttu-web:${TRAVIS_BRANCH}
  fi
fi