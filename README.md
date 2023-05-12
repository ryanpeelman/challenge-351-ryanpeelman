## Challenge

The context for this challenge is the following: you work at a company that powers a marketplace app for healthcare facilities to hire healthcare professionals (a.k.a. workers).

Your role is that of a senior software engineer that is in charge of the backend service and responsible for the shift eligibility feature.

Shift eligibility is a feature that allows you to know what shifts are eligible for a specific worker in specific facilities.

The entities that come into play are the following: `Shift`, `Facility`, `Worker`, `Document`, `FacilityRequirement`, and `DocumentWorker`.

Your task is to complete the following User Story:

Story: As a worker, I want to get all available shifts that I'm eligible to work for.

### Acceptance Criteria:

- In order for a Worker to be eligible for a shift, the rules are:
  - A `Facility` must be active,
  - The `Shift` must be active and not claimed by someone else,
  - The `Worker` must be active,
  - The `Worker` must not have claimed a shift that collides with the shift they are eligible for,
  - The professions between the `Shift` and `Worker` must match,
  - The `Worker` must have all the documents required by the facilities.
 - Given an active `Facility`, when I request all available `Shifts` within a start and end date, then it will return a list of `Shifts` from that `Facility` in the specified date range,
 - Given an inactive `Facility`, when I request all available `Shifts` within a start and end date, then it will not return a list of `Shifts` from that `Facility`,
 - Given a `Shift` is claimed and is within the requested start and end date, when I request all available `Shifts` within a start and end date, it will not return the claimed `Shift`,
 - The `Shifts` must be grouped by date.


We provide a PostgreSQL database and a seed file for the sake of the exercise. It is random such that:

- Some `Shifts` are claimed,
- Some `Workers` are inactive,
- Some `Facilities` are inactive,
- Some `Workers` don’t have all the documents a facility requires.


## Challenge expectations:

We expect you to provide an HTTP server following the REST convention (or whatever you think suits the best). We also expect the following to be part of your submission:

- Risk mitigation through proper testing,
- Proper documentation for your endpoint,
- Proper error handling and logging,
- A brief writeup on how you would guarantee a performant endpoint and how you measure its performance,
- (Bonus) Measure the performance of your endpoint and provide a brief report.


## Included in the challenge:

Seeding your database

We provide a folder called `seed` which contains a `docker-compose.yaml` file that helps you set up a database. It is a PostgreSQL database seeded with about 2 million records.

To set it up go into the `seed` folder and execute the command `docker compose up --build`. Once it's done, do not stop the docker compose. This way the database keeps running and you can have your framework of choice connect to the database using the following database URL: `postgres://postgres:postgres@localhost:5432/postgres`.

The seed script inserts a lot of workers. Among those workers, there are 3 that fulfill all document requirements; they all have one of the professions. The seed script prints their IDs and professions at the end, so that you can test your query and see the results.

## Submission:

Please submit your solution in form of a PR. You are free in the choice of language and framework for this challenge.

After you have submitted your PR, please tag **cbhrecruiters** as a reviewer to notify us about your submission.
