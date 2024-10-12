FROM node:lts AS runtime
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

ENV PUBLIC_TURNSTILE_SITE_KEY=placeholder
ENV TURNSTILE_SECRET_KEY=placeholder
ENV PUBLIC_UNSHORTENER_LINK=placeholder
ENV MONGODB_URI=placeholder

EXPOSE 4321

CMD npm run start
