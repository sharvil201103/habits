/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import Task from "../../../../models/task";
import { connectDB } from "../../../../tracker/lib/db";  

// ✅ PATCH - Update task (edit label, deadline, etc.) or toggle completion
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await req.json();

    // If the request contains only "toggle" action, flip completion status
    if (updates.toggleCompletion) {
      const task = await Task.findById(id);
      if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

      task.completed = !task.completed;
      await task.save();
      return NextResponse.json(task);
    }

    // Otherwise, update task details (label, deadline, etc.)
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// ✅ DELETE - Remove a task
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
