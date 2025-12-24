# --- Base Stage ---
FROM quay.io/centos/centos:stream10 AS builder

# Install common runtime and build dependencies
RUN rpm -Uvh https://rpms.remirepo.net/enterprise/10/remi/x86_64/remi-release-10.0-3.el10.remi.noarch.rpm && \
    dnf -y update && \
    dnf -y install dnf-plugins-core && \
    dnf config-manager --set-enabled crb && \
    dnf -y install \
    ruby \
    ruby-devel \
    rubygems \
    gcc \
    gcc-c++ \
    make \
    redhat-rpm-config \
    git \
    libffi-devel \
    zlib-devel \
    openssl-devel \
    libxml2-devel \
    libxslt-devel \
    vips \
    nodejs \
    npm \
    pandoc \
    && dnf clean all

RUN gem update --system

WORKDIR /srv/jekyll


COPY Gemfile Gemfile.lock .

RUN bundle config set --local path 'vendor/bundle' && \
    bundle install

COPY package.json package-lock.json ./
RUN npm install

# --- Final Stage ---
FROM quay.io/centos/centos:stream10

USER root

WORKDIR /srv/jekyll

RUN rpm -Uvh https://rpms.remirepo.net/enterprise/10/remi/x86_64/remi-release-10.0-3.el10.remi.noarch.rpm && \
    dnf -y update && \
    dnf -y install dnf-plugins-core && \
    dnf config-manager --set-enabled crb && \
    dnf -y install \
    ruby \
    vips \
    python3-pip \
    && dnf clean all

RUN pip3 install --upgrade nbconvert
# Create a non-root user
RUN groupadd -g 1000 jekyll && \
    useradd -u 1000 -g jekyll -m jekyll && \
    chown -R jekyll:jekyll /srv/jekyll

USER jekyll

# Copy dependencies from builder stages
COPY --from=builder --chown=jekyll:jekyll /srv/jekyll/vendor/bundle ./vendor/bundle
COPY --from=builder --chown=jekyll:jekyll /srv/jekyll/node_modules ./node_modules
COPY --from=builder --chown=jekyll:jekyll /srv/jekyll/Gemfile /Gemfile
COPY --from=builder --chown=jekyll:jekyll /srv/jekyll/Gemfile.lock /Gemfile.lock
COPY --from=builder --chown=jekyll:jekyll /srv/jekyll/package.json /package.json
COPY --from=builder --chown=jekyll:jekyll /srv/jekyll/package-lock.json /package-lock.json

# Copy the rest of the application code
COPY --chown=jekyll:jekyll . .

# Ensure bundler uses the local vendor path
RUN bundle config set --local path 'vendor/bundle'

# Expose the default Jekyll port
EXPOSE 4000

# Set the default command to serve the Jekyll site with live reload
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--incremental", "--livereload"]
