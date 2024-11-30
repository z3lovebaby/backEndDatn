# Sử dụng Node.js official image
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có) vào container
COPY package*.json ./

# Cài đặt các dependencies
# RUN npm install --save-dev nodemon@^2.0.15 ts-node@^10.7.0

RUN npm install
# Sao chép toàn bộ mã nguồn vào container
COPY . .
# Mở port 3000 (hoặc port mà backend của bạn đang lắng nghe)
EXPOSE 3000


# Lệnh để khởi động ứng dụng với nodemon và ts-node
CMD ["npx", "nodemon", "--exec", "npx", "ts-node", "src/index.ts"]
