# discord-congratulations-bot

A Node.js project for a Discord bot with an integrated REST API that sends a congratulatory messages including a random gif, whenever a user / student completes a sprint.

## Key Features

- **Automated Congratulatory Messages:** Sends personalized messages in the Discord server when users complete sprints.
- **REST API Integration:** Manages bot activities and data interactions, triggered by the school's application.
- **Dynamic Content Generation:** Fetches celebratory GIFs from external services and selects templates from a database.
- **Data Management:** Stores messages and metadata in a database.

## Technologies Used

- **Backend:** Express.js, Node.js
- **Database:** SQLite
- **ORM:** Kysely
- **Validation:** zod
- **Testing:** Vitest/Supertest
- **Code Quality:** ESLint, Prettier
- **Language:** TypeScript

## Setup

### Environment Variables

Create a `.env` file in the root of your project and add the following variables:

DISCORD_TOKEN=your_discord_token
DISCORD_CHANNEL_ID=your_discord_channel_id
DISCORD_GUILD_ID=your_discord_guild_id
GIPHY_API_KEY=your_giphy_api_key
DATABASE_URL=path/to/your/database.db

### Running the Application

1. Install dependencies:

   ```sh
   npm install

   ```

2. Start the server:

```sh
npm start
```

## Migrations

3. We can run migrations with the following command:

``sh
npm run migrate:latest

````

We can also make a new migration file:

```sh
npm run migrate:make <migration_name>
````

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```

## Seeding Database (manually)

```sh
sqlite3 path/to/your/database.db
```

-- Insert users
INSERT INTO users (user_name) VALUES
('johdoe'),
('janedoe'),
('johnsmith');

-- Insert sprints
INSERT INTO sprints (sprint_code, sprint_name) VALUES
('WD-1.1', 'Web Development Module 1 Sprint 1'),
('WD-1.2', 'Web Development Module 1 Sprint 2'),
('JS-2.1', 'JavaScript Module 2 Sprint 1');

-- Insert templates
INSERT INTO templates (message_template) VALUES
('Fantastic job, {username}! You have conquered {sprintTitle}! 🎉'),
('Well done, {username}! Your hard work on {sprintTitle} paid off! 🌟'),
('Congratulations, {username}! You aced {sprintTitle}! 🚀'),
('Awesome work, {username}! You successfully completed {sprintTitle}! 👏'),
('Great job, {username}! {sprintTitle} is now behind you! 🏆');

-- Verify the seed data
SELECT _ FROM users;
SELECT _ FROM sprints;
SELECT \* FROM templates;

## Interacting with the API

```bash
curl -X POST http://localhost:8000/messages -H "Content-Type: application/json" -d '{
  "username": "johdoe",
  "sprintCode": "WD-1.1"
}'
```
