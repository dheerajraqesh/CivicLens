# CivicLens

CivicLens is a modern complaint management platform for citizens and government employees, featuring:
- Complaint submission with geolocation (map)
- Role-based authentication (citizen/gov)
- Government dashboard for managing complaints
- Real-time status updates and completed complaint tracking
- Professional, responsive UI

---

## Project Structure

```
CivicLens/
├── backend/        # Express/MongoDB API
├── frontend/       # React app
├── .gitignore
├── README.md
```

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Create a `.env` file** in `backend/`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
3. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend runs at [http://localhost:5000](http://localhost:5000)

### Backend Dependencies
- express
- mongoose
- dotenv
- cors
- bcryptjs
- nodemon (dev)

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend app:**
   ```bash
   npm start
   ```
   The frontend runs at [http://localhost:3000](http://localhost:3000)

### Frontend Dependencies
- react
- react-dom
- react-scripts
- react-leaflet
- leaflet
- axios

---

## Usage
- Sign up as a citizen or government employee
- Citizens can submit complaints with map location
- Government employees can view, update, and mark complaints as completed
- All data is stored in MongoDB

---

## Environment Variables
- Backend: `backend/.env` (see above)
- Frontend: no .env needed for basic usage

---

## Development Notes
- All node_modules and .env files are gitignored
- For production, set up secure environment variables and production-ready MongoDB
- See `/frontend/src/components/` and `/backend/` for main code

---

## License
MIT

---

## Quickstart
```bash
# 1. Clone the repo
 git clone <repo-url>
 cd CivicLens

# 2. Setup backend
 cd backend
 npm install
 # Add .env (see above)
 npm start

# 3. Setup frontend (in a new terminal)
 cd ../frontend
 npm install
 npm start
```

---

For any issues, please open an issue or contact the maintainer.