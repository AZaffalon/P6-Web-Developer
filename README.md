# P6-Web-Developer

API sécurisée pour une application d'avis gastronomiques.

![alt text](https://user.oc-static.com/upload/2021/07/29/16275605596354_PiiquanteLogo.png)
## 👉 Requirements

Minimum version to install in the root of the project

| npm | >= 8.18.0 |
| - | - |
| node | >= 16.13.1 |
## 👉 Setup API

▶️ Clone this repository
```
git clone https://github.com/AZaffalon/P6-Web-Developer.git
```
▶️ Run `npm install` in the root of your folder

> ⚠️ Be sure to have installed the minimum version of npm and node

▶️ Create a **.env** file

▶️ Copy/paste the <ins>**.env.example**</ins> content inside your <ins>**.env**</ins> file and put your on own credentials 

(⚠️ except for SERVER_PORT that should be <ins>**3000**</ins>)

```
MONGO_URI = ""

JWT_TOKEN_SECRET  = ""

CRYPTOJS_KEY = ""

CRYPTOJS_IV = ""

SERVER_PORT = "3000"
```
## 👉 Launch the server

Run `nodemon server` or `nodemon`

> ⚠️ Server should run on localhost:3000

## 👉 Setup Front-end

For the front-end, please check the repository at this [link](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6/blob/master/README.md)