# Mini-Trello

Mini-Trello is a modern, high-performance task management application inspired by Trello, designed to streamline project organization through a seamless, high-engagement user experience. It focuses on speed, aesthetic excellence, and intuitive workflow management, making it an ideal platform for both individual productivity and team synergy.

## 🚀 Key Features

### Intelligent Organization
- **Dynamic Boards**: Create and manage multiple project boards tailored to different workflows.
- **List & Card Management**: Highly organized workflow with customizable lists and draggable cards.
- **Fluid Interaction**: Smooth, real-time drag-and-drop experience for effortless card reorganization.

###  Seamless Collaboration
- **Team Synergy**: Work together with others on the same project in real-time.
- **Member Management**: Track active contributors and project members within each board.
- **Intuitive Feedback**: Real-time visual indicators of active project states and user interactions.

### Effortless Sharing
- **Invite Links**: Board owners can generate unique, secure invite links to bring new collaborators on board instantly.
- **Instant Connection**: Shared links allow users to connect directly to specific boards, bypassing complex navigation.
- **Secure Access**: Collaboration is protected by managed access tokens, ensuring only invited members can contribute.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-trello
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example:
   # MONGODB_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # PORT=5000
   # FRONTEND_URL=http://localhost:5173
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
