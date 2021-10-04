FROM public.ecr.aws/lambda/nodejs:12
ARG FUNCTION_DIR="/var/task"

# Create function directory
RUN mkdir -p ${FUNCTION_DIR}

# Copy handler function and package.json
COPY index.js ${FUNCTION_DIR}

# COPY package.json ${FUNCTION_DIR}
# Install NPM dependencies for function

# RUN npm install
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]
