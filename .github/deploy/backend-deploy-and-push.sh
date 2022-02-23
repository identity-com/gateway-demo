#!/usr/bin/env bash
# Build and push new gateway sample express image
# Usage: ./scripts/backend-build-and-push.sh <TAGS>
# e.g. ./scripts/backend-build-and-push.sh latest 1.0.0

set -e
set -u

ECR_REPO_NAME="gateway-sample/express"
LOCAL_IMAGE_NAME="gateway-sample-express"

# build image
echo "$(tput setaf 3)Building image \"${LOCAL_IMAGE_NAME}\"...$(tput sgr0)"
docker build --build-arg SSH_PRIVATE="$(cat ~/.ssh/id_rsa)" --build-arg NPM_TOKEN=${NPM_TOKEN} -t ${LOCAL_IMAGE_NAME} -f backend/Dockerfile .
echo "$(tput setaf 3)Image \"${LOCAL_IMAGE_NAME}\" built.$(tput sgr0)"

# login into AWS ECR
echo "$(tput setaf 3)\nLogging into AWS ECR...$(tput sgr0)"
AWS_VERSION=$(aws --version | grep -q aws-cli/2 && echo 2 || echo 1)
if [ $AWS_VERSION -eq 1 ]; then
  # AWS CLI v1
  aws ecr get-login --no-include-email | sh
else
  # AWS CLI v2
  ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')
  aws ecr get-login-password | docker login \
    --username AWS \
    --password-stdin "${ACCOUNT_ID}".dkr.ecr.us-east-1.amazonaws.com
fi

echo "$(tput setaf 3)\nRetrieving the ECR repository URI \"${ECR_REPO_NAME}\"...$(tput sgr0)"
REPOSITORY_URI=`aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --query 'repositories[0].repositoryUri' 2> /dev/null || echo`
REPOSITORY_URI=`echo ${REPOSITORY_URI} | sed 's/\"//g'`
echo "ECR repository URI: ${REPOSITORY_URI}."

# Push any tag to the repository
for tag in "$@"; do
  echo "$(tput setaf 3)\nPushing tag \"${tag}\"...$(tput sgr0)"
  docker tag ${LOCAL_IMAGE_NAME} ${REPOSITORY_URI}:${tag}
  docker push ${REPOSITORY_URI}:${tag}
done
