# Plan It

Welcome to [Plan It](https://planit-z230.onrender.com/login)! This is a Trello-inspired web application that can be used for task management and issue tracking. 

## Built with
- ASP.NET Core WebAPI
- SQLite
- Entity Framework
- React
- Tailwind CSS

## Getting started
A live demo site is accessible [here](https://planit-z230.onrender.com/login). Note that it may take a minute to start up. Also note that data is not persistent, the site is only a demo. 

To get the app running locally on your computer, follow these steps. 

### Prerequisites

Make sure you have the following installed:

- [.NET SDK 9](https://dotnet.microsoft.com/download)
- [Node.js (LTS)](https://nodejs.org)
---

1. Clone the repo:

```
git clone https://github.com/ingrideliasson/PlanIt

```

2. Navigate to backend/ and restore dependencies:

```
cd backend
dotnet restore
```

3. Clean the database to ensure a fresh start:

```
dotnet ef database drop -f
dotnet ef database update
```

4. Run the API:

```
dotnet run
```

5. Navigate to the frontend folder and install dependencies

```
cd ../frontend
npm install
```

6. Start the development server:

```
npm start
```

### Note
Both the API and the frontend server need to be running in separate terminals for the app to work. 

## Usage

Plan It can be used for task management or issue tracking. Like Trello, it features a Kanban view where the user can create lists, add tasks to lists, and drag and drop tasks between lists. Users can also add other users to their board, and assign tasks to members. Keep reading for a detailed user guide. 

### 1. Register a user

The email does not have to be a real address, so you can use a dummy address. Choose a strong password. Note that the passwords are encrypted in the database and are not visible to anyone.
<img width="1562" height="881" alt="Register a user" src="https://github.com/user-attachments/assets/5643d486-6f2a-435f-8b46-a9beca65761a" />

### 2. Log in

After registration, you will be redirected to a login form. Log in with your credentials.

### 3. Create your board

Click "Add new board" and enter a title. After the board is created, you can update the title by clicking the edit button, or delete it with the delete button. Click the title of the board to navigate to the board view. 
<img width="1365" height="799" alt="Dashboard" src="https://github.com/user-attachments/assets/54182364-4a8b-469c-9f46-e8c173ed4b76" />


### 4. Create lists and tasks

You are now in the board view. Create a new list by cicking "Add new list" and enter a title. Add a task to the list by clicking "Add task" and enter a title. Click the title of the list to update it. Click the delete button to delete the list and all tasks on it. 
<img width="898" height="716" alt="Board view" src="https://github.com/user-attachments/assets/b58aa4f5-85a4-4b7c-b7c7-96d81d0f2b71" />

### 5. Task actions

Hover over the task to see a circle that can be clicked to mark the task as done. If you want to move a task, you can drag it and drop it on another list. Click the title of the task to update it. Click the cross to delete it. 
<img width="560" height="426" alt="Move tasks" src="https://github.com/user-attachments/assets/e6a48791-3cc4-4162-b586-dcc8f32ed4d1" />
<img width="564" height="432" alt="Mark as complete" src="https://github.com/user-attachments/assets/6509044c-2133-4c19-938f-5e83d88a6c2a" />

### 6. Add members to the board

In the header, click "Handle members" to search for other existing users by name or email address. Click "Add" to add a user to your board. When they are added, their avatar is added to your header. For the added user, your board will show up on their dashboard. Remove a member by clicking "Handle members" and "Remove". Only the owner of the board can add and remove other users to their board. Otherwise, invited members can perform all actions. 

<img width="478" height="147" alt="Handle members" src="https://github.com/user-attachments/assets/3ad120de-824e-4f81-9c61-b94ec235a1b1" />

<img width="384" height="216" alt="Skärmavbild 2025-09-15 kl  10 08 07" src="https://github.com/user-attachments/assets/6c5d0ebc-f1b3-4889-8b50-86299a9be47f" />

### 7. Assign members to task

Click the person icon on a task to assign members to it. All members added to the board can be assigned. When a member is assigned, their avatar will show up on the task. 

<img width="365" height="430" alt="Assign members" src="https://github.com/user-attachments/assets/2bae99e7-a533-4754-9c8a-596df5392e7e" />

<img width="1152" height="748" alt="Skärmavbild 2025-09-16 kl  12 34 20" src="https://github.com/user-attachments/assets/35c6f597-d142-4363-b8e9-82f868559f50" />





