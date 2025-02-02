/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    const fileName = params.filename;
    try {
        const obj = await getRequestContext().env.IMAGES.get(fileName);

        if (obj === null) {
            return new Response("Object Not Found", { status: 404 });
        }
        return new Response(obj.body);
    } catch (err) {
        console.log(err);
        return Response.json({ status: "error" });
    }
} 