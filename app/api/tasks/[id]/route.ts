/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task";
import { connectDB } from "@/tracker/lib/db";

// ✅ GET - Fetch a task by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    
    const task = await Task.findById(id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

// ✅ PATCH - Update task (edit label, deadline, etc.) or toggle completion
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await req.json();

    const task = await Task.findById(id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // If the request contains only "toggle" action, flip completion status
    if (updates.toggleCompletion) {
      task.completed = !task.completed;
      await task.save();
      return NextResponse.json(task);
    }

    // Otherwise, update task details (label, deadline, etc.)
    Object.assign(task, updates);
    await task.save();

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// ✅ DELETE - Remove a task
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete task", error }, { status: 500 });
  }
}
