import { NextRequest, NextResponse } from "next/server";
import { supabaseWithServiceRole } from "@/lib/supabase";

// Use service role client for database operations
const supabase = supabaseWithServiceRole;

interface LineEvent {
  type: string;
  message?: {
    type: string;
    text?: string;
  };
  source?: {
    userId: string;
  };
  replyToken?: string;
}

interface LineWebhookBody {
  events: LineEvent[];
}

async function replyToLINE(replyToken: string, text: string) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken || !replyToken) {
    return;
  }

  try {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${channelAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: "text",
            text,
          },
        ],
      }),
    });
  } catch (error) {
    console.error("❌ Failed to reply to LINE:", error);
  }
}

async function saveLineUserId(lineUserId: string) {
  try {
    const { data, error } = await supabase
      .from("line_subscriptions")
      .upsert(
        {
          line_user_id: lineUserId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "line_user_id" },
      )
      .select();

    if (error) {
      console.error("❌ Database error:", error);
      return false;
    }

    console.log(`✅ Saved LINE user ID: ${lineUserId}`);
    return true;
  } catch (error) {
    console.error("❌ Error saving LINE user ID:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify LINE webhook signature
    const signature = request.headers.get("x-line-signature");
    const channelSecret = process.env.LINE_CHANNEL_SECRET;

    if (!signature || !channelSecret) {
      console.warn("⚠️  Missing signature or channel secret");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const body = await request.text();

    // Verify signature (simple validation)
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", channelSecret)
      .update(body)
      .digest("base64");

    if (signature !== hash) {
      console.warn("❌ Invalid LINE webhook signature");
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    const jsonBody: LineWebhookBody = JSON.parse(body);

    // Process each event
    for (const event of jsonBody.events) {
      console.log("📨 LINE Webhook Event:", event.type);

      // Handle message event
      if (
        event.type === "message" &&
        event.message?.type === "text" &&
        event.source?.userId &&
        event.replyToken
      ) {
        const messageText = event.message.text;
        const lineUserId = event.source.userId;
        const replyToken = event.replyToken;

        // Check if user sent subscription message
        if (messageText === "รับแจ้งเตือน") {
          const saved = await saveLineUserId(lineUserId);

          if (saved) {
            await replyToLINE(
              replyToken,
              "✅ บันทึกสำเร็จแล้ว! คุณจะได้รับแจ้งเตือนเมื่อมีผู้ติดต่อผ่านเว็บไซต์",
            );
          } else {
            await replyToLINE(replyToken, "❌ เกิดข้อผิดพลาด กรุณาลองใหม่");
          }
        } else if (messageText === "ยกเลิกแจ้งเตือน") {
          // Handle unsubscribe
          try {
            const { error } = await supabase
              .from("line_subscriptions")
              .delete()
              .eq("line_user_id", lineUserId);

            if (!error) {
              await replyToLINE(replyToken, "✅ ยกเลิกการรับแจ้งเตือนแล้ว");
              console.log(`✅ Removed LINE user ID: ${lineUserId}`);
            } else {
              await replyToLINE(replyToken, "❌ เกิดข้อผิดพลาด");
            }
          } catch (error) {
            console.error("❌ Error removing subscription:", error);
            await replyToLINE(replyToken, "❌ เกิดข้อผิดพลาด");
          }
        } else {
          // Send help message for unknown commands
          await replyToLINE(
            replyToken,
            "👋 ยินดีต้อนรับ!\n\n📝 คำสั่ง:\n• รับแจ้งเตือน - รับแจ้งเตือนเมื่อมีผู้ติดต่อ\n• ยกเลิกแจ้งเตือน - หยุดรับแจ้งเตือน",
          );
        }
      }

      // Handle follow event (user adds bot)
      if (event.type === "follow" && event.source?.userId) {
        console.log(`👤 New LINE follower: ${event.source.userId}`);
        if (event.replyToken) {
          await replyToLINE(
            event.replyToken,
            "👋 ยินดีต้อนรับ! พิมพ์ 'รับแจ้งเตือน' เพื่อรับแจ้งเตือนเมื่อมีผู้ติดต่อผ่านเว็บไซต์",
          );
        }
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("❌ LINE Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
