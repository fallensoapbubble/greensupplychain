

# 🌿 Green Supply Chain Logistics AI

An intelligent and eco-aware logistics platform powered by **MERN** and **Flask**. This full-stack application uses AI-driven insights to optimize supply chain routes, reduce carbon emissions, and improve operational efficiency—all while supporting sustainability goals.

## 🚚 Features
- ♻️ AI-powered logistics and route optimization
- 🔍 Emissions tracking with predictive analytics
- 🧠 Machine learning models served via Flask APIs
- 🔐 Secure login and role-based access management
- 📊 Real-time dashboard for supply chain monitoring

---

## 🛠️ Project Setup

### 🔮 Frontend

**Tech Stack**: React, TailwindCSS, Redux, Axios

**Setup**:
```bash
cd frontend
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to launch the app in development mode.


---

### 🧪 Flask Services

**Service 1: AI Model Server**

Serves ML models for route optimization and sustainability scoring.


**Service 2: Emission Analytics API**

Handles carbon footprint calculation and analytics.

**Setup**:
```bash
cd flask/emissions-api
pip install -r requirements.txt
python app.py
```

Both Flask servers should run concurrently alongside the MERN stack.

---

## 📦 Build

To create a production-ready React build:
```bash
npm run build
```
This outputs the minified build files to the `build/` folder.



