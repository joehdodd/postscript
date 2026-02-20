"use server";
import { requireAuth } from "../auth";
import { prisma } from "@repo/prisma";

const PROMPTS = [
  "What are your goals for this week?",
  "What challenges did you face last week and how did you overcome them?",
  "What are you grateful for today?",
  "What is one thing you want to improve on this week?",
  "What was a recent success you had and how did it make you feel?",
  "What is something new you want to try this week?",
  "How do you plan to take care of yourself this week?",
  "What is a positive affirmation you can repeat to yourself this week?",
  "What is one thing you can do to make someone else's day better this week?",
  "What is a lesson you learned recently that you want to remember?"
];

export async function generatePrompt() {
  const { userId } = await requireAuth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        userId,
        content: PROMPTS[Math.floor(Math.random() * PROMPTS.length - 1)] || "What are your goals for this week?",
        frequency: 'weekly',
      },
    });

    return { success: true, prompt: newPrompt };
  } catch (error) {
    console.error("Error generating new prompt:", error);
    return { success: false, message: "Failed to generate new prompt." };
  }
}

