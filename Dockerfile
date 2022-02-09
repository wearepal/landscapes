FROM ruby:3.0.3-alpine AS base
ENV RACK_ENV=production RAILS_ENV=production NODE_ENV=production
RUN apk add --no-cache bash imagemagick libpq postgresql-client redis tzdata vips zip
RUN gem install bundler -v '~> 2.2'
RUN bundle config set deployment 'true'
RUN bundle config set without 'development test'
WORKDIR /app
ENV MALLOC_ARENA_MAX=2

FROM base AS builder
RUN apk add build-base git postgresql-dev vips-dev yarn
COPY Gemfile Gemfile.lock package.json rete-connection-plugin-0.9.0.tgz yarn.lock /app/
RUN bundle install
RUN yarn install
COPY . /app
RUN SECRET_KEY_BASE="0" bin/rails assets:precompile
RUN rm -rf node_modules

FROM base
COPY --from=builder /app /app
