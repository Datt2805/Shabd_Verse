# AWS Deployment Guide for Backend and Database

This guide covers the steps to host your Node.js backend, Redis, and MongoDB database on a single AWS EC2 instance. 

## Prerequisites
- An AWS Account.
- Your frontend hosted on GitHub/GitLab/Vercel/Netlify.
- The `database` folder (which has already been backed up for you in your project directory).

---

## Step 1: Launch an AWS EC2 Instance
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **EC2** -> **Instances** -> **Launch instances**.
3. **Name**: `shabdverse-backend`.
4. **AMI**: Choose **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
5. **Instance type**: `t2.micro` (Free tier eligible).
6. **Key pair**: Create a new key pair (RSA, `.pem`), download it, and keep it safe. You will need this to connect to the server.
7. **Network settings**: 
   - Allow SSH traffic from anywhere.
   - Allow HTTP and HTTPS traffic from the internet.
   - Edit Security Group to add a **Custom TCP rule** for port `5000` (Backend port) temporarily, so you can test it.
8. Click **Launch instance**.

---

## Step 2: Connect to your EC2 Instance
1. Open PowerShell or Terminal on your local machine.
2. Navigate to the folder where you saved your `.pem` key file.
3. Run the following command to connect (replace with your key name and EC2 public IP):
   ```bash
   ssh -i "shabdverse-password.pem" ubuntu@52.204.35.61
   ```

---

## Step 3: Install Node.js, MongoDB, and Redis
Once connected to the EC2 instance, run the following commands sequentially:

**1. Update system packages:**
```bash
sudo apt update
sudo apt upgrade -y
```

**2. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**3. Install MongoDB:**
```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**4. Install Redis:**
```bash
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis
```

---

## Step 4: Upload and Restore Your Database
We have already backed up your local database to the `database` folder in your project.

1. Open a new Terminal on your **local machine** (do not close the EC2 terminal).
2. Navigate to the directory containing your `.pem` file.
3. Use `scp` to copy the `database` folder to your EC2 instance (Replace values accordingly):
   ```bash
   scp -i "shabdverse-password.pem" -r "d:\College Project\frontend and backend\frontend and backend\database" ubuntu@52.204.35.61:~/database
   ```
4. Go back to your **EC2 SSH terminal** and restore the database using `mongorestore`:
   ```bash
   mongorestore --db book_exchange ~/database/book_exchange
   ```

---

## Step 5: Setup the Backend Code
1. Clone your repository containing the backend code to the EC2 instance:
   ```bash
   git clone https://github.com/Datt2805/Shabd_Verse.git
   cd Shabd_Verse/backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```

---

## Step 6: Configure Environment Variables
1. Create a `.env` file in the backend folder on EC2:
   ```bash
   nano .env
   ```
2. Paste your local `.env` variables into it. Update `FRONTEND_URL` to your actual hosted frontend URL (e.g., on Vercel/Netlify):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/book_exchange
   JWT_SECRET=supersecretjwtkey
   FRONTEND_URL=https://your-frontend-domain.com
   REDIS_URL=redis://localhost:6379
   IMAGEKIT_PUBLIC_KEY=public_RNzEul7qWzQIFuRty8dCpOJyOT0=
   IMAGEKIT_PRIVATE_KEY=private_yiAT4WHhj3wWrG3J4uq9nI/DxL0=
   IMAGEKIT_URL_ENDPOINT=https://imagekit.io/dashboard/media-library/L2NvbGxlZ2UgUHJvamVjdA
   ```
   *(Press `Ctrl+X`, then `Y`, then `Enter` to save and exit).*

---

## Step 7: Run the Backend with PM2
To keep the backend running in the background even after you close the SSH terminal, use PM2.

1. Install PM2 globally:
   ```bash
   sudo npm install -g pm2
   ```
2. Start the backend server:
   ```bash
   pm2 start index.js --name "shabdverse-backend"
   ```
3. Ensure PM2 restarts automatically if the EC2 server reboots:
   ```bash
   pm2 startup
   pm2 save
   ```

---

## Step 8: Update Frontend API URL
Now that your backend is running on `http://52.204.35.61:5000`, you need to update your frontend code (which is hosted separately) to point to this new URL.

1. Go to your frontend code.
2. Find where the API base URL is defined (usually in a `.env` file or Axios configuration).
3. Change it to: `http://52.204.35.61:5000`.
4. Commit and push the changes to Git so your frontend hosting platform deploys the update.

*(Note: If your frontend is served over HTTPS, browsers will block HTTP API requests due to Mixed Content. In a production environment, you will eventually want to link a Domain Name to your EC2 instance and set up an SSL Certificate using Nginx and Let's Encrypt).*

---

## Step 9: Push Frontend to GitHub
Since you updated your API URL to point to AWS, it's time to push your frontend code to GitHub.

1. Open a local terminal in your `frontend` folder.
2. Add and commit your changes:
   ```bash
   git add .
   git commit -m "Updated API URL for AWS Deployment"
   ```
3. Go to [GitHub](https://github.com/) and create a new repository (e.g., `ShabdVerse-Frontend`).
4. Link it and push your code (replace with your actual GitHub link):
   ```bash
   git branch -M main
   git remote add origin https://github.com/Datt2805/ShabdVerse-Frontend.git
   git push -u origin main
   ```

---

## Step 10: Host Frontend for Free (Vercel)
Vercel is the fastest, standard way to host Vite/React applications for free straight from GitHub.

1. Go to [Vercel.com](https://vercel.com/) and Sign Up / Log In using your **GitHub account**.
2. Click **"Add New Project"**.
3. It will show a list of your GitHub repositories. Click **"Import"** next to your frontend repository.
4. Leave all the default settings (it will automatically detect that you are using Vite).
5. Click **"Deploy"**.
6. Wait 1-2 minutes. Vercel will build your app and generate a live, public URL for you! (e.g., `https://shabdverse.vercel.app`).

**FINAL IMPORTANT TWEAK:**
Once you get your live Vercel URL, go back to your **Ubuntu SSH Terminal** and update the `.env` file one last time so your backend accepts connections from the real domain:
```bash
nano .env
# Change FRONTEND_URL=http://localhost:8080 to your Vercel URL
```
Then restart your backend to apply it:
```bash
pm2 restart shabdverse-backend
```


