FROM schachr/raspbian-stretch:latest

LABEL version="0.1" \
      description="Test docker image for joybox" \
      maintainer="Simon Dellenbach <sdellenb@gmail.com>"

# Install prerequisites

RUN apt-get update \
 && apt-get install -y curl \
 && apt-get clean

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
 && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
 && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
 && apt-get update \
 && apt-get install -y nodejs yarn \
 && apt-get clean

# Setup the app.
ADD . /opt/joybox
WORKDIR /opt/joybox
RUN yarn

EXPOSE 3000/tcp
