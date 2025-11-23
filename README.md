# Plan It

Welcome to Plan It! This is a web application that can be used for task management and issue tracking. It features full CRUD, full authentication/authorization, a colorful UI, and a Kanban view with seamless drag-and-dropping. 

https://github.com/user-attachments/assets/5404802f-9931-42a6-bcaa-5210608c5e5d

## Built with
- ASP.NET Core WebAPI
- SQLite
- Entity Framework
- React (Javascript)
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
<img width="1307" height="654" alt="Skärmavbild 2025-11-07 kl  16 25 19" src="https://github.com/user-attachments/assets/d4af5139-90fd-44b7-b26c-376c2a110387" />

### 2. Log in

After registration, you will be redirected to a login form. Log in with your credentials.

### 3. Create your board

Click "Add new board" and enter a title. After the board is created, you can update the title by clicking the edit button, or delete it with the delete button. Click the title of the board to navigate to the board view. 

<img width="1306" height="777" alt="Skärmavbild 2025-11-07 kl  15 50 12" src="https://github.com/user-attachments/assets/299cf848-257a-4a9d-8026-e9893abdcbe6" />


### 4. Create lists and tasks

You are now in the board view. Create a new list by cicking "Add new list" and enter a title. Add a task to the list by clicking "Add task" and enter a title. Click the title of the list to update it. Click the delete button to delete the list and all tasks on it. Lists can be reordered by dragging and dropping.

<img width="901" height="496" alt="Skärmavbild 2025-11-07 kl  15 57 34" src="https://github.com/user-attachments/assets/e40e5567-3775-4ecb-a168-a9a36d937317" />


### 5. Task actions

Hover over the task to see a circle that can be clicked to mark the task as done. If you want to move a task, you can drag it and drop it on another list. Click the title of the task to update it. Click the cross to delete it. 

<img width="565" height="326" alt="Skärmavbild 2025-11-07 kl  16 19 28" src="https://github.com/user-attachments/assets/3089add8-194f-4709-b2ff-5c96390e356c" />
<img width="568" height="363" alt="Skärmavbild 2025-11-07 kl  15 59 35" src="https://github.com/user-attachments/assets/3c900e7b-0eca-4ffb-a101-a0f86460d02c" />

### 6. Add members to the board

In the header, click "Handle members" to search for other existing users by name or email address. Click "Add" to add a user to your board. When they are added, their avatar is added to your header. For the added user, your board will show up on their dashboard. Remove a member by clicking "Handle members" and "Remove". Only the owner of the board can add and remove other users to their board. Otherwise, invited members can perform all actions. 

<img width="497" height="141" alt="Skärmavbild 2025-11-07 kl  16 01 30" src="https://github.com/user-attachments/assets/dbbb41bb-9d0c-4686-b124-6627ce60fa34" />
<img width="361" height="202" alt="Skärmavbild 2025-11-07 kl  16 22 24" src="https://github.com/user-attachments/assets/ee9ead1f-9fc6-41e4-bc47-28e6440f0f06" />

### 7. Assign members to task

Click the person icon on a task to assign members to it. All members added to the board can be assigned. When a member is assigned, their avatar will show up on the task. 

<img width="337" height="395" alt="Skärmavbild 2025-11-07 kl  16 01 55" src="https://github.com/user-attachments/assets/2aca203b-986e-4d6a-8332-8b2791a2e483" />
<img width="1688" height="620" alt="Skärmavbild 2025-11-07 kl  16 03 37" src="https://github.com/user-attachments/assets/2bb18de3-a642-48ce-b878-141f1c3cf5d7" />





