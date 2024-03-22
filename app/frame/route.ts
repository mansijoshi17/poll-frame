import { NextRequest, NextResponse } from "next/server";
import { getConnectedAddressForUser } from "@/utils/fc";
import { mintNft, balanceOf } from "@/utils/mint";
import { PinataFDK } from "pinata-fdk";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/frame`,
      buttons: [{ label: "Mint NFT", action: "post" }],
      aspect_ratio: "1:1",
      cid: "QmVe3MAWXhH1z27sn8SvSp8vUtC1staQMPP3xBzibv3vZA",
    });
    return new NextResponse(frameMetadata);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const fid = body.untrustedData.fid;
  const address = await getConnectedAddressForUser(fid);
  const balance = await balanceOf(address);
  const { isValid, message } = await fdk.validateFrameMessage(body);
  console.log(balance);
  if (typeof balance === "number" && balance !== null && balance < 1) {
    try {
      const mint = await mintNft(address);
      console.log(mint);
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.BASE_URL}/redirect`,
        buttons: [
          { label: "Learn how to make this", action: "post_redirect" },
        ],
        aspect_ratio: "1:1",
        cid: "QmQQYh6beZLHhNucXKRCJM8EVWgDQCBdaEHyqcWSLemGtm",
      });
      if (isValid) {
        await fdk.sendAnalytics("frame-mint-tutorial-mint", body);
      }

      return new NextResponse(frameMetadata);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  } else {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/redirect`,
      buttons: [
        { label: "Learn how to make this!", action: "post_redirect" },
      ],
      aspect_ratio: "1:1",
      cid: "QmYTXErszk9Mgwn51dgYYxLo1qhfXe3v2y8DNWFcwkBjc7",
    });
    if (isValid) {
      await fdk.sendAnalytics("frame-mint-tutorial-mint", body);
    }

    return new NextResponse(frameMetadata);
  }
}
