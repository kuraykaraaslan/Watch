import axios from "axios";
import crypto from "crypto";
import { Snapshot, Url } from "@prisma/client";
import prisma from "../libs/prisma";

export default class SnapshotService {


    static async fetchUrlBody(url: string): Promise<string> {
        await axios.get(url).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
            throw new Error(error);
        });

        return "";
    }

    static async hashString(str: string): Promise<string> {
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    static async hashLinkBody(link: string): Promise<string> {
        console.log(link);
        const body = await this.fetchUrlBody(link);

        const hash = await this.hashString(body);

        console.log(hash);

        return hash;
    }   

    static async createSnapshot(url: Url): Promise<Snapshot> {

        const hash = await this.hashLinkBody(url.link);

        const snapshot = await prisma.snapshot.create({
            data: {
                urlId: url.urlId,
                hash
            }
        });

        return snapshot;
    }

    static async getSnapshotsByURL(urlId: string): Promise<Snapshot[]> {
        const snapshots = await prisma.snapshot.findMany({
            where: {
                urlId
            }
        });

        return snapshots;
    }

    static async getLatestSnapshot(urlId: string): Promise<Snapshot | null> {
        const snapshots = await this.getSnapshotsByURL(urlId);

        return snapshots[snapshots.length - 1];
    }

    static async createOrUpdateSnapshot(url: Url): Promise<{ snapshot: Snapshot, isNew: boolean }> {
        const lastSnapshot = await this.getLatestSnapshot(url.urlId);

        if (!lastSnapshot) {
            const snapshot = await this.createSnapshot(url);
            return { snapshot, isNew: true };
        }

        const hash = await this.hashLinkBody(url.link);

        if (lastSnapshot.hash === hash) {
            return { snapshot: lastSnapshot, isNew: false };
        }

        const snapshot = await this.createSnapshot(url);

        return { snapshot, isNew: true };
    }

}