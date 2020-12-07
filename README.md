# Feed-Service-Rest-API
Feed Service Rest API is a microservice to create, update and authenticate user. It is a part of Udagram API and is separated into three microservices.

1. [User-Service-Rest-API] - It is used for handling user operations like adding, updating user.
2. [Feed-Service-Rest-API] - It is used for handling feed operation like uploading images, adding caption for image etc.
3. [Image-Filter-API] - It is used to format images

## Tasks

### Setup Node Environment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

###  Refactor the API
The API code currently contains logic for both /users and /feed endpoints. Decompose the API code so that we can have two separate projects that can be run independent of one another.

### Containerize the Code
Start with creating Dockerfiles for the backend applications. Each project should have its own Dockerfile.

    - `docker build -t <docker-tag-name>`
    - `docker <docker-hub-username>/<docker-tag-name>` 
    - `docker push <docker-hub-username>/<docker-tag-name>`

### Build CICD Pipeline
After setting up your GitHub account to integrate with Travis CI, set up a GitHub repository with a .travis.yml file for a build pipeline to be generated. Travis CI will automate the process for creating docker image and pushing it to docker hub repository.

### Create EKS Cluster and Node groups
Node groups are EC2 instances which will host our API's.

### Connect to EKS Cluster using Kubectl
    - `aws eks --region <region> update-kubeconfig --name <cluster-name>`

### Create/Configure deployment and service yaml file
    - `kubectl apply -f deployment.yaml`
    - `kubectl apply -f service.yaml`

    This will fetch image from docker hub.
