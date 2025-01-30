"use server";
import { NextResponse } from "next/server";
import UrlService from "@/services/UrlService";
import AuthService from "@/services/AuthService";
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

    return NextResponse.json({ url });

  }
  catch (error : any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for deleting a urly by its ID.
 * @param request - The incoming request object
 * @param context - Contains the URL parameters, including postId
 * @returns A NextResponse containing a success message or an error message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { urlId: string } }
) {
  try {

    AuthService.authenticateSync(request, "ADMIN");
    
    const { urlId } = params;
    const url = await UrlService.getUrlById(urlId);

    if (!url) {
      return NextResponse.json(
        { message: "Url not found." },
        { status: 404 }
      );
    }

    await UrlService.deleteUrl(url.urlId);

    return NextResponse.json(
      { message: "Url deleted successfully." }
    );
  }
  catch (error : any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a post by its ID.
 * @param request - The incoming request object
 * @param context - Contains the URL parameters, including postId
 * @returns A NextResponse containing the updated post data or an error message
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { urlId: string } }
) {
  try {

    AuthService.authenticateSync(request, "ADMIN");

    const { urlId } = params;
    const url = await UrlService.getUrlById(urlId);

    if (!url) {
      return NextResponse.json(
        { message: "Url not found." },
        { status: 404 }
      );
    }

    const data = await request.json();
    
    const updatedUrl = await UrlService.updateUrl(url.urlId, data);

    return NextResponse.json({ url: updatedUrl });
  }
  catch (error : any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}