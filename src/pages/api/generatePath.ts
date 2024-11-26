// pages/api/generatePath.ts

import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey:
    "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",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { commands } = req.body;

  if (!commands || !Array.isArray(commands)) {
    res.status(400).json({ error: "Commands array is required" });
    return;
  }

  try {
    // ChatCompletion 생성
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a navigation assistant.
            You will receive a list of commands ("GO", "BACK", "LEFT", "RIGHT", "MIDDLE", "STOP").
            Your task is to compute the path coordinates by applying these commands one by one, starting from the initial point (x: 0, y: 0).
            
           Rules:
            - "GO" or "BACK":
              1. Look through **all previous commands** in reverse order to find the most recent "LEFT", "RIGHT", "MIDDLE", or "STOP".
              2. If the most recent of these commands was "LEFT", move by -1 along the x-axis.
              3. If the most recent of these commands was "RIGHT", move by +1 along the x-axis.
              4. If the most recent of these commands was "MIDDLE"  or "STOP" or none of these commands exist, x remains unchanged.

            - "GO": move forward by +1 along the y-axis.
            - "BACK": move backward by -1 along the y-axis.
            - "STOP": do not change the coordinates.
            
            You should keep a running tally of the coordinates as you process each command.
            Start at coordinates (x: 0, y: 0).
            
            Respond with a JSON object containing an array named 'path' with the list of coordinates.
            Each coordinate should only contain 'x' and 'y' fields in this format: {"x": value, "y": value}.
            No other information is needed.Do not add any comments or additional explanations in the JSON response`,
        },
        {
          role: "user",
          content: `Based on these commands, generate a path with X and Y coordinates in JSON format with the name 'path' and values x, y: ${commands.join(
            ", "
          )}`,
        },
      ],
    });

    // 응답 데이터에서 결과 추출
    let content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in OpenAI response");
    }
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let path;
    try {
      path = JSON.parse(content);
      console.log(path);
      // Check if path is an object containing an array
      if (Array.isArray(path.path)) {
        path = path.path.map((point: { x: number; y: number }) => ({
          x: point.x,
          y: point.y,
        }));
      } else {
        throw new Error("Parsed response does not contain a path array");
      }
    } catch (e) {
      console.error(
        "Failed to parse OpenAI response content as JSON:",
        content
      );
      throw new Error("Failed to parse OpenAI response");
    }

    res.status(200).json({ path });
  } catch (error: any) {
    console.error("OpenAI API Error:", error.message || error);
    res.status(500).json({ error: "Failed to generate path from commands." });
  }
}
