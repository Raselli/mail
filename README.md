# CS50 Web Project 3: "mail"
This project is an assignment from the course: [CS50 Web Programming with Python and Javascript](https://cs50.harvard.edu/web/2020/).

## Assignment
Design a front-end for an email client that makes API calls to send and receive emails.
Assignment details [here](https://cs50.harvard.edu/web/2020/projects/3/mail/).

## Project Description
“E-Mail” allows registered users to access different mailboxes:
* The user has an **Inbox** in which all incoming e-mail is collected. 
* Inside the **”Sent”** mailbox, the user will find all composed e-mails after sending.
* The “Archived” mailbox contains all archived-flagged mail.

In the section **Compose** the user may write and send e-mails.
* **"Unread"** e-mails are marked white and change to grey after opening.

Opened e-mails have two buttons: “Archive” and “Reply”:
* **"Archive"** flags an e-mail as “archived” and moves it to the “Archived Mailbox”.
* **"Reply"** allows users to reply to e-mails, prefilling the *Subject*, *Recipient* and *Body*.

## Technical Description
Django handles all server request and the database (written in Python). The distribution code includes already most python code to run this project. The assignment was solely focused on writing client-side server-requests in JavaScript and server-responses in Python, such that the client is able to asynchronously request and receive data which is then rendered in the browser.
* Client-requests are executed using **“JS Fetch API”** for asynchronous server requests (static/inbox.js). 
* The server answers with JSON-Responses to fetch-requests (views.py).
* JSON-answers received by the client are then asynchronously rendered on the page.
There is no **csrf-token protection** due to it being a requirement by the assignment specifications.

## Project Demo
Click [here](https://youtu.be/VpAb0k-PE40) to watch a demonstration of this project on YouTube.

## Distribution Code 
[Distribution Code](https://cdn.cs50.net/web/2020/spring/projects/3/mail.zip). 
All further requirements and terminal commands to run this project are found on the [Project Assignment Page](https://cs50.harvard.edu/web/2020/projects/3/mail/)
