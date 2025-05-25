import { NextResponse } from "next/server";

export async function POST(req) {
  // Extract idToken from Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
  }
  const idToken = authHeader.replace("Bearer ", "");

  // Parse request body
  const body = await req.json();
  const { query_text, project_id, tags } = body;

  // Validate required fields
  if (!query_text || !project_id) {
    return NextResponse.json({ error: "query_text and project_id are required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://u9pvrypbbl.execute-api.us-east-1.amazonaws.com/prod/rccs/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        query_text,
        project_id,
        tags: tags || [],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || `API request failed with status ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}