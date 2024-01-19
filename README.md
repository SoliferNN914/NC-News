# Northcoders News API

Northcoders News API is a backend project aimed at creating a database containing articles, comments, users and other relevant data to be used as a backbone of a fronend project for a website. This API was created to give user the ability to work and interact with data in a similar manner as used in websites such as Reddit. This project allows users to post articles, add comments and also delete them if necessary. Such behaviour may sound very familiar since many social media websites utilise very similar approach in terms of user communication. User can work with the data by utilising various endpoints, which will be described later in this file. Altough if you wish to work on this repository then all steps on how to set up a working environment for this project will be described thoroughly in this file.

### Link To A Hosted Version (https://nc-news-qzx0.onrender.com)

------------------------------------------------------------------

# Instructions for hosted version

1. Copy **URL** into your browser, for better results please use Chrome, since JSON Fromatter extension can be installed for better data readability.
2. Firsly you will be presented with **Cannot GET /** message, add **/api** to see all available endpoints, your **URL** should look like this **https://nc-news-qzx0.onrender.com/api**
3. You can choose any endpoint from the list and add it to the **URL** follow instructions on how to use and you will be able to see the data

-------------------

# Instructions to work on a repo locally

## Cloning and opening repository

1. Clone git repository, you can copy command provided
`https://github.com/JackCollier/nc-news-api.git`
2. cd into repository which contains the repo
`cd NC-News`
3. You can open repository in VSCode using `code .` command

## Initial Setup

Install dependencies
`npm install`
To make sure that all dependencies were installed correctly open package.json file, dependencies should contain the following:
```    
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "fs.promises": "^0.1.2",
    "pg": "^8.11.3"
```
To setup your local database run `npm run setup-dbs`.
And to seed local database run `npm run seed`.
You can run tests using `npm run test` or `npm t`.

## Creating .env files

You will need to create two **.env** files, **.env.development** and **.env.test**. In each file add `PGDATABASE=` with the correct datababase.
Check **/db/setup.sql** to see database names.

# Minimum requirements

Node.js version **v21.5.0** or above
Posrgres version **14.10** or above

To see your version of Node.js run `node -v` command
For Postgres version run `psql --version` command