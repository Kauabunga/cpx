###################################################
#
# Use phusion/passenger-full as base image.
#
###################################################


FROM phusion/passenger-full:0.9.18


# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]



###########################
######## CPX-START ########
###########################


ENV NODE_ENV production


# disable nginx disabler
RUN rm -f /etc/service/nginx/down

# Configure NGINX
RUN rm /etc/nginx/sites-enabled/default
ADD ./docker/docker-webapp.conf /etc/nginx/sites-enabled/webapp.conf
ADD ./docker/docker-env.conf /etc/nginx/main.d/webapp-env.conf

# Bundle app source
# TODO test to see if ./dist is there otherwise use . (build branch)
RUN mkdir /home/app/webapp
COPY . /home/app/webapp
WORKDIR "/home/app/webapp"
RUN ls -ltra .

# Install app dependencies
RUN npm install --production

# Setup permissions
RUN chmod -R a+rwx /home/app/webapp


###########################
########  CPX-END  ########
###########################



# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

