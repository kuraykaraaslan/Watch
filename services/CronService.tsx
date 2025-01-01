import { Snapshot } from "@prisma/client";
import SnapshotService from "./SnapshotService";
import UrlService from "./UrlService";
import MailService from "./MailService";

export default class CronService {

    static ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;

    static intervalToMinutes: { [key: string]: number }[] = [
        { "everyOneMin": 1 },
        { "everyFiveMin": 5 },
        { "everyTenMin": 10 },
        { "everyFifteenMin": 15 },
        { "everyThirtyMin": 30 },
        { "everyHour": 60 },
        { "everyDay": 1440 }
    ]

    static async doCronJob(interval: string): Promise<string> {

        const test = await SnapshotService.fetchUrlBody("https://www.google.com");

        const minutesObj = this.intervalToMinutes.find((item) => item[interval]);
        const minutes = minutesObj ? minutesObj[interval] : undefined;

        if (minutes === undefined) {
            throw new Error("Invalid interval");
        }

        const urls = await UrlService.getByInterval(minutes);

        for (const url of urls) {
            console.log(`Pinging ${url.link}`);
        }

        for (const url of urls) {

            try {

                console.log(`${url}`);

                // get the last snapshots
                const { isChanged, lastSnapshot, newSnapshot } = await SnapshotService.fetchThenCompareIfChangedThenSave(url);

                if (isChanged) {
                    MailService.sendMail(this.ADMIN_EMAIL, `New snapshot for ${url.link}`, `Hello, a new snapshot has been created for ${url.link}`);
                    console.log(`New snapshot for ${url.link}`);
                }
                else {
                    console.log(`No changes detected for ${url.link}`);
                }

            } catch (error : any) {
                MailService.sendMail(this.ADMIN_EMAIL, `Error for ${url.link}`, `Hello, an error occurred while creating a snapshot for ${url.link}. Error: ${error.message}`);
                console.error(`Error for ${url.link}: ${error.message}`);
            }


        }


        return `Cron job ran for ${minutes} minutes`;
    }

}