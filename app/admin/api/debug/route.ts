export async function GET() {
  return Response.json({
    message: "Debug endpoint - check browser console instead",
    instructions: [
      "Open your browser DevTools (F12 or Cmd+Option+I)",
      "Go to Console tab",
      "Run these commands:",
      "1. document.body.className",
      "2. window.getComputedStyle(document.body).fontFamily",
      "3. window.getComputedStyle(document.documentElement).getPropertyValue('--font-kanit')",
    ],
  });
}
