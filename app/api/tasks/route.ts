/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import { connectDB } from "../../../tracker/lib/db";  
import Task from "../../../models/task";

// ✅ GET all tasks
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// ✅ POST - Create a task
export async function POST(req: Request) {
  try {
    await connectDB();
    const { label, coins, deadline, repeated } = await req.json();
    const newTask = new Task({ label, coins, deadline, repeated });
    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
