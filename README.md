# 🛍️ The Gadget Store – Full Stack E-commerce App

A modern, responsive full stack e-commerce store built with:

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Deployment**: Netlify (frontend), Render (backend)
- **Live Demo**:
  - 🌐 Frontend: [https://thegadetstore.netlify.app](https://thegadetstore.netlify.app)
  - ⚙️ Backend: [https://ecommerce-backend-scdt.onrender.com](https://ecommerce-backend-scdt.onrender.com)

---

## 📁 Folder Structure 

```bash
project/

Frontend-root/
│
│── client/              # React frontend   
│   └── dist/            # Auto-generated production build
│
│── .env 	             #contains backend URL (VITE_BACKEND_URL=https://ecommerce-backend-scdt.onrender.com)
Backend-root/
│── photos/              # Static image assets (used to be 'Images')
│
│── client/              # Auto-generated frontend to be served up directly by ‘Express’
│   └── dist/               
│── products.json        # Mock database
│── server.js            # Main backend entry point
│── .env                 # Stripe secret key 
