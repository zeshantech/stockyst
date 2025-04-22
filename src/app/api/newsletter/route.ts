import { NextResponse } from "next/server";
import pool from "@/lib/db";

// First, create the newsletter table if it doesn't exist
async function ensureTableExists() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

export async function POST(request: Request) {
  try {
    // Ensure the table exists
    await ensureTableExists();

    // Parse the request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Insert the email into the database
    await pool.query(
      "INSERT INTO newsletter_subscriptions (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [email]
    );

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to the newsletter" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to the newsletter" },
      { status: 500 }
    );
  }
}
