# tinynet
[Tinynet -URL Shortener](https://tinynet.sudhanshu.io)

Tinynet URL Shortener is a web application that allows users to create shortened URLs for any destination URLs they choose. The app is built using [CSS, TypeScript, Node.js, Express, EJS, MySQL].

## Features

- User registration and login
- URL shortening
- Custom alias creation
- Analytics tracking (e.g. clicks, referrers, countries)
- RESTful API endpoints for integration with other applications

## Installation and Usage

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install`.
2. Setup a MySQL Database name `any_name` and change the same in database config under `src/config/mysql.ts`.
3. Run the typescript compiler using `npm run tsc`.
3. Run the application using `npm run dev`.
4. Open the application in your web browser at `http://localhost:PORT`.

## API Endpoints

The following endpoints are available for use in other applications:

- `/p/short`: Creates a short URL for a given destination URL.
- `/:shortUrlCode`: Redirects you to original website.

## Contributors

- [Sudhanshu](https://github.com/ks961)

## License

This project is licensed under the MIT license. See the [LICENSE.md](LICENSE.md) file for details.
