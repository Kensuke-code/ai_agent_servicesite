FROM node:24.12.0 

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "dev"]