# Url shortener

Made with Angular 6.1.2, Node.js 8.11.3, Express.js 4.16.0 and Bootstrap 4.1.3

This app allows to shorten user-supplied urls and redirects to them.
Also this app has features of counting used url, deleting urls, that has been created in 15 days, and frontend/backend logging.

Usage:
1. Enter url in the first field
2. Enter custom name for the generated url or just let system do the work for you by clicking 'submit' button
3. Copy generated link and paste it in adress bar.

Deployment (prod):
1. Download and unzip the project to folder.
2. cd to folder
3. Run npm install
4. cd to folder/client
5. Run npm install && ng build
6. cd back to the original folder
7. run npm start
8. Check http://localhost:3001

Deployment (dev):

1. Download and unzip the project to folder.
2. cd to folder
3. Run npm install
4. cd to folder/client
5. Run npm install && npm start
6. cd back to the original folder
7. run npm start
8. Check http://localhost:4200
