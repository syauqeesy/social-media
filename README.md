# Social Media

## Introduction
The project is created as the requirement in the BRI Life recruitment process. This project is implemented OOP and Dependency Injection pattern. The design pattern that implemented including Facade Pattern, Interface Seggregation (in `foundation/database.ts`), Adapter (`foundation/http.ts` and `foundation/database.ts`). And it using service, model, repository pattern. All of that is aims to achive ease of maintainablity, single responsibility principle, better organization of the project codebase.

## Get Started
Create a `.env` file in root folder, the example can be found in `.env.example`. For the `APPLICATION_SECRET` it can be filled with any random string but I recommend to generate a cryptographically secure random string.

Requirements:
* Node.js 22
* MySQL ^5.7

First you need to create database and run/import `init.sql` that can be found in root folder.

### Scripts
Transpile TypeScript files:
```npm run typescript``` or
```npm run typescript-watch``` for watch mode.

Run the Server:
```npm run start``` or
```npm run start-dev``` for development run using nodemon.

### API Documentation
You can import the postman api docs using this [social-media-api-docs.json](./social-media-api-docs.json).

## Security Features
### Authentication and Authorization
Some API are protected by authentication and authorization like in update and delete api, current user must be the owner of the resource if it want to modify it. The authentication is using JWT and the tokens are stored in database for added security for manual invocation if the `access_token` is compromised and make sure that after the user logged out the token can't be used.

### Input Validation
All of the user input including body, files, path params and query params are validated before entering the service layer.

### Error Handling
All the possible error including user input error or system error like database error are handled properly and the management of the error is centralized in `foundation/helper.ts/httpErrorHandler` to make sure all sensitive information is not leaked to the front end and the user will just get `500 internal server error` if the error was a system error.

### SQL Prepared Statements
All of the query that has user input inside is using the prepared statements to make sure the query statement and data are separated to prevent SQL Injection.

### Logging and Monitoring
The project is already implemented centralized logging using winston, the log can be found in `storage/application.log` and `console.log`. This will achieve observability that can be usefull when something happen like error or when the application security is compromised, it can be use to tracing the root cause. And every user request is logged and of course sensitive information like `password` and `access_token` is masked so the person that have the access to the log is can't exploit that.
