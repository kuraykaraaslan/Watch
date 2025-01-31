# Watchdog

Watchdog is a web monitoring service that fetches, processes, and tracks changes in web pages using Puppeteer and Prisma. It is designed to detect content changes efficiently by leveraging XPath-based extraction and hash comparison.

## Features

- Fetches web pages using both Axios (for simple pages) and Puppeteer (for dynamic content)
- Extracts specific content using XPath
- Cleans and normalizes extracted HTML
- Generates SHA-256 hashes for content comparison
- Stores snapshots in a PostgreSQL database using Prisma ORM
- Tracks changes and saves new snapshots if content has been modified
- Sends alerts for detected changes

## Installation

### Prerequisites
- Node.js (>=16.x)
- PostgreSQL database
- Prisma CLI 
- Chromium browser (for Puppeteer)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/watchdog.git
   cd watchdog
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the database:
   ```sh
   cp .env.example .env
   ```
   Update `.env` file with your PostgreSQL credentials.
4. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the application:
   ```sh
   npm start
   ```

## Usage

### Fetch and Compare URL Changes
The core function of Watchdog is `fetchThenCompareIfChangedThenSave(url: Url): Promise<boolean>`, which:
1. Fetches the web page
2. Extracts content using XPath
3. Cleans and hashes the content
4. Compares it with the latest snapshot
5. Saves a new snapshot if changes are detected

Example usage:
```ts
import SnapshotService from "./services/SnapshotService";
import { Url } from "@prisma/client";

const url: Url = {
    urlId: 1,
    link: "https://example.com",
    xpath: "//div[@id='content']"
};

(async () => {
    const hasChanged = await SnapshotService.fetchThenCompareIfChangedThenSave(url);
    console.log(`Content changed: ${hasChanged}`);
})();
```

### Closing the Browser Instance
To close the Puppeteer instance manually:
```ts
await SnapshotService["closeBrowser"]();
```

## Configuration
- **User Agents**: Defined in `SnapshotService.userAgents`
- **Puppeteer Arguments**: Configured in `getBrowser()`
- **Hashing Algorithm**: SHA-256

## Technologies Used
- **Node.js** - Backend runtime
- **Puppeteer** - Headless browser automation
- **Axios** - HTTP requests
- **XPath** - Content extraction
- **Crypto** - Hashing content
- **Prisma** - ORM for database management
- **PostgreSQL** - Database for storing snapshots

## Roadmap
- Implement caching mechanism
- Support for additional selectors (CSS, JSON APIs)
- Add alerting system (email, webhook notifications)
- Improve Puppeteer concurrency handling

## License
This project is licensed under the MIT License.

---

Happy monitoring! 🚀

