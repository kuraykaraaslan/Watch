"use server";

import { NextResponse } from "next/server";
import NextRequest from "@/types/NextRequest";
import CronService from "@/services/CronService";

/**
 * GET handler for retrieving all users.
 * @param request - The incoming request object
 * @returns A NextResponse containing the user data or an error message
 */
export async function GET(request: NextRequest,
  { params }: { params: { interval: string } }
) {

    try {

        const {interval} = await params;
        
        await CronService.doCronJob(interval);

        return NextResponse.json(
            { message: "Cron job ran successfully" },
            { status: 200 }
        );
        
    }
    
    catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
