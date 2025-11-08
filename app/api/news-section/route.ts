import { NextResponse } from "next/server";
import { getContentCollection } from "@/models/Content";

export async function GET() {
  try {
    const col = await getContentCollection();
    
    // ดึงข้อมูลการ์ดทั้ง 3
    const [card1, card2, card3] = await Promise.all([
      col.findOne({ key: "news_section_card_1" }),
      col.findOne({ key: "news_section_card_2" }),
      col.findOne({ key: "news_section_card_3" }),
    ]);

    return NextResponse.json({
      card1: card1 ? {
        label: card1.data?.label as string || "",
        title: card1.title || "",
        description: card1.body || "",
        imageUrl: card1.data?.imageUrl as string || undefined,
        link: card1.data?.link as string || undefined,
        backgroundColor: card1.data?.backgroundColor as string || undefined,
        textColor: card1.data?.textColor as string || undefined,
      } : undefined,
      card2: card2 ? {
        label: card2.data?.label as string || "",
        title: card2.title || "",
        description: card2.body || "",
        imageUrl: card2.data?.imageUrl as string || undefined,
        link: card2.data?.link as string || undefined,
        backgroundColor: card2.data?.backgroundColor as string || undefined,
        textColor: card2.data?.textColor as string || undefined,
      } : undefined,
      card3: card3 ? {
        label: card3.data?.label as string || "",
        title: card3.title || "",
        description: card3.body || "",
        imageUrl: card3.data?.imageUrl as string || undefined,
        link: card3.data?.link as string || undefined,
        backgroundColor: card3.data?.backgroundColor as string || undefined,
        textColor: card3.data?.textColor as string || undefined,
      } : undefined,
    });
  } catch (error) {
    console.error("Error fetching news section:", error);
    return NextResponse.json(
      { card1: undefined, card2: undefined, card3: undefined },
      { status: 500 }
    );
  }
}

