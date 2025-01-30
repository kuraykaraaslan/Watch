import { Url, User } from '@prisma/client';
import prisma from '@/libs/prisma';

export default class UrlService {

    private static sqlInjectionRegex = /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)|(--)|(\b(AND|OR|NOT|IS|NULL|LIKE|IN|BETWEEN|EXISTS|CASE|WHEN|THEN|END|JOIN|INNER|LEFT|RIGHT|OUTER|FULL|HAVING|GROUP|BY|ORDER|ASC|DESC|LIMIT|OFFSET)\b)/i; // SQL injection prevention


    /**
        * Creates a new url with regex validation.
        * @param data - Url data
        * @returns The created url
        */
    static async createUrl(data: {
        title: string;
        link: string;
    }): Promise<any> {

        var { title, link } = data;

        // Validate input
        if (!title) {
            throw new Error('All fields are required.');
        }

        // Validate input
        const existingUrl = await prisma.url.findFirst({
            where: { link },
        });

        if (existingUrl) {
            throw new Error('Url with this link already exists.');
        }

        // Create the url
        const url = await prisma.url.create({
            data: {
                title,
                link,
            },
        });

        return url;

    }

    /**
     * Retrieves all urls with optional pagination and search.
     * @param page - The page number
     * @param pageSize - The page size
     * @param search - The search query
     * @returns The urls and total count
     */
    static async getAllUrls(page: number, pageSize: number, search?: string): Promise<{ urls: Url[], total: number }> {

        if (search && this.sqlInjectionRegex.test(search)) {
            throw new Error('Invalid search query.');
        }

        const where = search ? {
            OR: [
                { title: { contains: search } },
                { url: { contains: search } },
            ],
        } : {};

        const urls = await prisma.url.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const total = await prisma.url.count({ where });

        return { urls, total };
    }

    /**
     * Retrieves a url by its ID.
     * @param urlId - The ID of the url
     * @returns The requested url or null if not found
     */
    static async getUrlById(urlId: string): Promise<Url | null> {
        const url = await prisma.url.findUnique({
            where: { urlId },
        });

        return url;
    }

    /**
     * Updates a url by its ID.
     * @param urlId - The ID of the url
     * @param data - The updated url data
     * @returns The updated url
     */
    static async updateUrl(urlId: string, data: {
        title: string;
        link: string;
    }): Promise<Url> {
            
            const { title, link } = data;
    
            const url = await prisma.url.update({
                where: { urlId },
                data: {
                    title,
                    link,
                },
            });
    
            return url;
        }

    /**
     * Deletes a url by its ID.
     * @param urlId - The ID of the url
     * @returns The deleted url
        */
    static async deleteUrl(urlId: string): Promise<Url> {
        const url = await prisma.url.delete({
            where: { urlId },
        });

        return url;
    }


    /**
     * Retrieves a url by its link.
     * @param link - The link of the url
     * @returns The requested url or null if not found
     */
    static async getUrlByLink(link: string): Promise<Url | null> {
        const url = await prisma.url.findFirst({
            where: { link },
        });

        return url;
    }


    /**
     * Deletes all urls.
     * @returns The deleted urls
     * */
    static async deleteAllUrls(): Promise<void> {
        const urls = await prisma.url.deleteMany();

        return;
    }

    /**
     * Gets by interval
     * @param interval - The interval
     * @returns The urls
     */
    static async getByInterval(interval: number): Promise<Url[]> {
        const urls = await prisma.url.findMany({
            where: { invertal: interval },
        });

        return urls;
    }
}