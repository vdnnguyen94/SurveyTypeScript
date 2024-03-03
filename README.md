# Survey Web Application using Node TypeScript and React TypeScript

## Overview
The Survey Web Application is built using the MERN STACK, incorporating MongoDB, Express, React, and Node with TypeScript. This platform empowers users to create and customize survey questions, including Multiple Choice, True/False, and Text Field options. 

Users have the flexibility to set an expiration date for surveys or manage their state from Inactive to Active, ensuring that only Active Surveys (not expired) are displayed to users. Additionally, surveys can contain multiple questions tailored to the user's needs.

The application offers essential account management functionalities. Users can reset their password, update their password, and modify their profile name. However, it's important to note that the username and email cannot be changed.
### The Challenge:
Implementing NodeTypeScript is harder since TypeScript requires type checking, validation of objects before accessing variables, and installing type definitions for files and libraries. 
Managing survey questions and responses with varying structures (Multiple Choice, True/False, and Text Field Questions) proved challenging. Ensuring data consistency and integrity became paramount, especially for multiple-choice questions.


## How I Solved It:
Utilizing MongoDB and Mongoose, I implemented a robust data schema for survey questions. The model includes validations to ensure the integrity of data based on the question type.

For example, for multiple-choice questions (MC), the system enforces constraints such as the number of possible answers, their length, and the length of the survey results array.

This meticulous design guarantees a consistent and secure survey experience, preventing data discrepancies and enhancing the overall functionality of the application.

## Special Function: Download Survey Results
As the owner of a survey, you have the capability to download comprehensive survey results for in-depth data analysis. This feature provides a JSON file containing general survey information and detailed insights into each survey question.

This powerful tool empowers you to extract valuable data, facilitating informed decision-making and a deeper understanding of participant responses.

# <span style="color:red">START APPLICATION</span>
## Building Main Application
npm install
## Building Client React Application
cd client && yarn install && yarn build
## Building Server Application
cd ../server && npm install && npm run build
## Start the Application
yarn dev or npm run dev
