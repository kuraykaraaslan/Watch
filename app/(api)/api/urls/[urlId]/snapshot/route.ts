"use server";
import { NextResponse } from "next/server";
import UrlService from "@/services/UrlService";
import SnapshotService from "@/services/SnapshotService";
import NextRequest from "@/types/NextRequest";

/**
 * GET handler for retrieving a urly by its Id.
 * @param request - The incoming request object
 * @param context - Contains the URL parameters, including postId
 * @returns A NextResponse containing the post data or an error message
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { urlId: string } }
) {
  try {
    const { urlId } = params;
    const url = await UrlService.getUrlById(urlId);

    if (!url) {
      return NextResponse.json(
        { message: "Url not found." },
        { status: 404 }
      );
    }

    if (!url.link) {
      return NextResponse.json(
        { message: "Url has no link." },
        { status: 404 }
      );
    }

    const hash = await SnapshotService.hashLinkBody(url.link);

    return NextResponse.json({ url, hash });

  }
  catch (error : any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
