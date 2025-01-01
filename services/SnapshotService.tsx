import axios from "axios";
import dom, { Node } from "@xmldom/xmldom";
import crypto from "crypto";
import { Snapshot, Url } from "@prisma/client";
import prisma from "../libs/prisma";
import puppeteer, { Browser, Page } from "puppeteer";

import { JSDOM } from "jsdom";
import xpath from "xpath";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import AIService from "./AIService";

const jsdom = require("jsdom");

export default class SnapshotService {

    public static userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    ];


    public static browser: Browser | null = null;

    private static async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            console.log("Launching new Puppeteer browser...");
            this.browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox"],
                executablePath: "/usr/bin/chromium-browser",
            });
        }
        return this.browser;
    }

    static async fetchUrlBody(url: string): Promise<string> {
        try {
            console.log(`Fetching URL: ${url}`);
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching URL:", error);
            throw new Error(error);
        }
    }

    static async fetchUrlBodyV2(url: string): Promise<string> {
        const browser = await this.getBrowser();
        const page = await browser.newPage(); // This should return a valid Puppeteer Page

        try {
            console.log(`[FETCH] Fetching URL via Puppeteer: ${url}`);
            await page.setUserAgent(this.userAgents[Math.floor(Math.random() * this.userAgents.length)]);
            await page.setCacheEnabled(false);
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 8000 });

            await page.waitForSelector("body", { timeout: 5000 });

            const content = await page.content();
            console.log(`[FETCH] Fetched content: ${content.substring(0, 100)}...`);
            return content;
        } catch (error: any) {
            console.error(`[ERROR] Puppeteer fetch failed: ${error.message || error}`);
            throw new Error(`Puppeteer fetch failed: ${error.message || "Unknown error"}`);
        } finally {
            await page.close();
        }
    }



    static async hashString(str: string): Promise<string> {
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    static getElementByXPath(html: string, xpath: string): string | null {
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        const result = doc.evaluate(xpath, doc, null, dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        
        if (result.singleNodeValue && result.singleNodeValue instanceof dom.window.Element) {
            return (result.singleNodeValue).outerHTML;
        }
        
        return null;
    }
    
    
     

    static cleanHtml(html: string): string {
        return html
            .replace(/\s+/g, " ") // Normalize spaces
            .replace(/<!--.*?-->/g, "") // Remove comments
            .replace(/<script.*?>.*?<\/script>/gi, "") // Remove scripts
            .replace(/<style.*?>.*?<\/style>/gi, "") // Remove styles
            .replace(/<[^>]*>/g, "") // Remove all HTML tags
            .trim();
    }

    static async saveSnapshot(url: Url, hash: string, content: string): Promise<Snapshot> {

        const snapshot = await prisma.snapshot.create({
            data: {
                urlId: url.urlId,
                hash: hash,
                content: content,
            }

        });
        return snapshot;
    }

    static async getLatestSnapshot(url: Url): Promise<Snapshot | null> {
        const snapshot = await prisma.snapshot.findFirst({
            where: {
                urlId: url.urlId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return snapshot;
    }

    static async isSnapshotChanged(url: Url, hash: string): Promise<boolean> {
        const latestSnapshot = await this.getLatestSnapshot(url);
        if (!latestSnapshot) {
            return true;
        }
        return latestSnapshot.hash !== hash;
    }

    static async fetchThenCompareIfChangedThenSave(url: Url): Promise<{
        isChanged: boolean; 
        lastSnapshot: Snapshot | null;
        newSnapshot: Snapshot | null;
    }> 
    {
        try {
            console.log(`[${url.link}] Starting fetch and compare process.`);

            const html = await this.fetchUrlBodyV2(url.link);
            //console.log(`[${html.toString()}] HTML fetched successfully.`);
            //console.log(`[${url.link}] HTML fetched successfully.`);

            let parsedHtml = await this.getElementByXPath(html, url.xpath) as string;
            console.log(`typeof parsedHtml: ${parsedHtml}`);
            //console.log(`[${parsedHtml}] XPath parsed result: ${parsedHtml.substring(0, 100)}...`);

            parsedHtml = this.cleanHtml(parsedHtml); // Clean the extracted content
            //console.log(`[${url.link}] Cleaned content: ${parsedHtml.substring(0, 100)}...`);

            const hash = await this.hashString(parsedHtml);
            //console.log(`[${url.link}] Hash generated: ${hash}`);

            const isChanged = await this.isSnapshotChanged(url, hash);
            //console.log(`[${url.link}] Snapshot changed: ${isChanged}`);

            const lastSnapshot = await this.getLatestSnapshot(url);

            let newSnapshot: Snapshot | null = null;

            if (isChanged) {
                const newSnapshot = await this.saveSnapshot(url, hash, parsedHtml);
            }

            return {
                isChanged: isChanged,
                lastSnapshot: lastSnapshot,
                newSnapshot: newSnapshot ?? null
            };

        } catch (error: any) {
            console.error(`Error processing snapshot for ${url.link}:`, error.message || error);
            throw new Error(`Error processing snapshot for ${url.link}: ${error.message || "Unknown error"}`);
        }
    }

    private static async closeBrowser() {
        if (this.browser) {
            console.log("Closing Puppeteer browser...");
            await this.browser.close();
            this.browser = null;
        }
    }


}
