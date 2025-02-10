import { NextResponse } from "next/server";
import { connectDB } from "../../../tracker/lib/db";
import Task from "../../../models/task";

// ✅ DELETE expired repeated tasks
export async function DELETE() {
  try {
    await connectDB();
    const now = new Date();
    await Task.deleteMany({ repeated: true, deadline: { $lt: now } });
    return NextResponse.json({ message: "Expired repeated tasks removed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to cleanup tasks" }, { status: 500 });
  }
}
