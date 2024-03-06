<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

### Table of Contents

- [Introduction](#introduction)
- [Design Patterns](#design-patterns)
- [System Architecture](#system-architecture)
- [API Design](#api-design)
- [Conclusion](#conclusion)

### Introduction

This document provides an overview of the design patterns, architecture, and API designs of a system designed to manage and execute cron jobs. The system allows for the scheduling, updating, and deletion of cron jobs, as well as querying existing jobs.

### Design Patterns

#### Factory Pattern

The system utilizes the Factory pattern in the creation of cron jobs. This is evident in the use of the `create` method, which abstracts the complexities involved in creating new cron job instances. This pattern allows for flexibility and scalability in creating various types of cron jobs without modifying existing code.

#### Singleton Pattern

The `CronJobService` acts as a Singleton, ensuring that there is a single instance of the service throughout the application. This is crucial for managing the state of cron jobs consistently across the application.

#### Strategy Pattern

The Strategy pattern is employed in the handling of different scheduling strategies for cron jobs. The system can schedule jobs daily, hourly, or at any custom interval specified by the user, demonstrating the use of different strategies based on the job's schedule.

### System Architecture

The system is structured around a central `CronJobService` that manages all operations related to cron jobs. This service interacts with a model layer, which abstracts the data access logic, and an HTTP service for triggering external actions when a cron job executes.

#### Components

- **CronJobService**: Central service for managing cron jobs.
- **Model Layer**: Abstraction over the data storage, responsible for creating, updating, and deleting cron job records.
- **HTTP Service**: Used to make external HTTP requests when a cron job is triggered.

#### Data Flow

1. **Creation**: Users submit cron job details through an API. The `CronJobService` processes this data, creates a new cron job record, and schedules the job for execution.
2. **Execution**: When a cron job is due, the `CronJobService` triggers an HTTP request via the HTTP Service, based on the job's configuration.
3. **Management**: Users can update, delete, or query cron jobs through the API. The `CronJobService` handles these requests by interacting with the model layer and adjusting the scheduled tasks as needed.

### API Design

The system exposes a RESTful API for managing cron jobs. Below are the key endpoints:

- `POST /cronjobs`: Create a new cron job.
- `GET /cronjobs`: Retrieve all scheduled cron jobs.
- `GET /cronjobs/{id}`: Retrieve a specific cron job.
- `PUT /cronjobs/{id}`: Update a specific cron job.
- `DELETE /cronjobs/{id}`: Delete a specific cron job.

Each cron job can be configured with the following parameters:

- `name`: Name of the cron job (optional).
- `triggerLink`: URL to trigger when the job executes.
- `apiKey`: API key for authentication (optional).
- `schedule`: Cron schedule string.
- `startDate`: Start date and time for the cron job (optional).

```json
{
  "name": "string",
  "triggerLink": "string (URL)",
  "apiKey": "string (optional)",
  "schedule": "string",
  "startDate": "string (date-time)"
}
```

---

## Installation

```bash
$ npm install
```

## Running the app

make sure to start local mongodb server before starting the nestjs server
```bash
# start mongodb server on linux like machine
$ sudo systemctl start mongod

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

