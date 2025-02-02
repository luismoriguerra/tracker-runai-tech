import { NextRequest } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { nanoid } from "nanoid";

export const runtime = "edge";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string; budget_id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Generate a unique filename
        const extension = file.name.split(".").pop();
        const filename = `${params.id}-${params.budget_id}-${nanoid()}.${extension}`;

        // Upload to R2
        await getRequestContext().env.IMAGES.put(filename, file);

        return Response.json({ filename });
    } catch (error) {
        console.error("Error uploading file:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 