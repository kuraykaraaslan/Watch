"use server";

import { NextResponse } from "next/server";
import UrlService from "@/services/UrlService";
import AuthService from "@/services/AuthService";
import NextRequest from "@/types/NextRequest";


/**
 * GET handler for retrieving all posts with optional pagination and search.
 * @param request - The incoming request object
 * @returns A NextResponse containing the posts data or an error message
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract query parameters
        const page = searchParams.get('page') ? parseInt(searchParams.get('page') || '1', 10) : 1;
        const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize') || '10', 10) : 10;
        const search = searchParams.get('search') || undefined;

        const result = await UrlService.getAllUrls(page, pageSize, search);

        return NextResponse.json({ urls: result.urls, total: result.total });

    }
    catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST handler for creating a new post.
 * @param request - The incoming request object
 * @returns A NextResponse containing the new post data or an error message
 */
export async function POST(request: NextRequest) {
    try {

        AuthService.authenticateSync(request, "ADMIN");

        const body = await request.json();

        //check if the body is [] or {},

        const { title, link } = body;

        const data = {
            title,
            link,
        };

        const url = await UrlService.createUrl(data);

        return NextResponse.json({ url });


    }
    catch (error: any) {
        console.error(error.message);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE handler for deleting all urls.
 * @param request - The incoming request object
 * @returns A NextResponse containing a success message or an error message
 * */

export async function DELETE(request: Request) {
    try {
        await UrlService.deleteAllUrls();

        return NextResponse.json(
            { message: "All urls deleted successfully." }
        );
    }
    catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }

}