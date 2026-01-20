import { NextRequest, NextResponse } from "next/server";

async function sendToLINE(
  name: string,
  phone: string,
  service: string,
  message: string,
) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds = process.env.LINE_USER_IDS?.split(",") || [];

  if (!channelAccessToken || lineUserIds.length === 0) {
    console.warn("⚠️  LINE configuration not set. Skipping LINE notification.");
    return;
  }

  const lineMessage = {
    type: "flex",
    altText: "มีการติดต่อจากหน้าเว็บไซน์",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "📧 ติดต่อจากเว็บไซต์",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
          },
        ],
        backgroundColor: "#FF6600",
        paddingAll: "12px",
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "box",
            layout: "baseline",
            spacing: "sm",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "ชื่อ:",
                color: "#AAAAAA",
                size: "sm",
                flex: 2,
              },
              {
                type: "text",
                text: name,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 5,
              },
            ],
          },
          {
            type: "box",
            layout: "baseline",
            spacing: "sm",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "เบอร์:",
                color: "#AAAAAA",
                size: "sm",
                flex: 2,
              },
              {
                type: "text",
                text: phone,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 5,
              },
            ],
          },
          {
            type: "box",
            layout: "baseline",
            spacing: "sm",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "บริการ:",
                color: "#AAAAAA",
                size: "sm",
                flex: 2,
              },
              {
                type: "text",
                text: service,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 5,
              },
            ],
          },
          {
            type: "box",
            layout: "vertical",
            margin: "md",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "ข้อความ:",
                color: "#AAAAAA",
                size: "sm",
              },
              {
                type: "text",
                text: message,
                wrap: true,
                color: "#666666",
                size: "sm",
              },
            ],
          },
          {
            type: "separator",
            margin: "md",
          },
          {
            type: "text",
            text: `⏰ ${new Date().toLocaleString("th-TH")}`,
            size: "xs",
            color: "#AAAAAA",
            margin: "md",
          },
        ],
      },
    },
  };

  try {
    for (const userId of lineUserIds) {
      const response = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${channelAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userId.trim(),
          messages: [lineMessage],
        }),
      });

      if (response.ok) {
        console.log(`✅ LINE message sent to user: ${userId.trim()}`);
      } else {
        const errorData = await response.text();
        console.error(
          `❌ Failed to send LINE message to ${userId.trim()}:`,
          errorData,
        );
      }
    }
  } catch (error) {
    console.error("❌ LINE API Error:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the received data
    console.log("📧 Contact Form Submission:");
    console.log("================================");
    console.log("Name:", body.name);
    console.log("Phone:", body.phone);
    console.log("Service:", body.service);
    console.log("Message:", body.message);
    console.log("Timestamp:", new Date().toISOString());
    console.log("================================");

    // Send to LINE
    await sendToLINE(body.name, body.phone, body.service, body.message);

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        data: {
          name: body.name,
          phone: body.phone,
          service: body.service,
          message: body.message,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Contact Form Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process contact form",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
