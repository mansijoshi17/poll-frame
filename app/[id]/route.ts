import { NextRequest, NextResponse } from "next/server";
import { getConnectedAddressForUser } from "@/utils/fc";
import { mintNft, balanceOf, getPoll } from "@/utils/mint";
import { PinataFDK } from "pinata-fdk";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
  const pollLink = req.nextUrl.pathname.split("/").pop(); // Extract the poll link from the URL
  console.log(pollLink);
  const pollData: any = await getPoll(pollLink); // Retrieve the poll data based on the link

  if (pollData) {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/redirect`,
      buttons: pollData.choices.map((choice: any) => ({
        label: choice.value,
        action: "post_redirect",
      })), // Create a button for each choice
      aspect_ratio: "1:1",
      image: {
        url: `https://placehold.co/1920x1005/white/black?text=${pollData.title}`,
      },
    });
    return new NextResponse(frameMetadata);
  }

  // if (pollData) {
  //   // Respond with frame metadata that displays the poll
  //   const frameMetadata = await fdk.getFrameMetadata({
  //     post_url: `${process.env.BASE_URL}/vote/${pollLink}`, // Endpoint for voting on the poll
  //     buttons: pollData.choices.map((choice: any) => ({
  //       label: choice,
  //       action: "post",
  //     })), // Create a button for each choice
  //     aspect_ratio: "1:1",
  //     image: {
  //       url: `https://placehold.co/1920x1005/white/white?text=${pollData.title}`,
  //     },
  //   });

  //   return new NextResponse(frameMetadata);
  // } else {
  //   // Handle the case where the poll link is invalid or the poll does not exist
  //   return new NextResponse("Poll not found", { status: 404 });
  // }
}

// export async function POST(req: NextRequest, res: NextResponse) {
//   const body = await req.json();
//   const fid = body.untrustedData.fid;
//   const address = await getConnectedAddressForUser(fid);
//   const balance = await balanceOf(address);
//   const { isValid, message } = await fdk.validateFrameMessage(body);
//   console.log(balance);
//   if (typeof balance === "number" && balance !== null && balance < 1) {
//     try {
//       const mint = await mintNft(address);
//       console.log(mint);
//       const frameMetadata = await fdk.getFrameMetadata({
//         post_url: `${process.env.BASE_URL}/redirect`,
//         buttons: [
//           { label: "Learn how to make this", action: "post_redirect" },
//         ],
//         aspect_ratio: "1:1",
//         cid: "QmQQYh6beZLHhNucXKRCJM8EVWgDQCBdaEHyqcWSLemGtm",
//       });
//       if (isValid) {
//         await fdk.sendAnalytics("frame-mint-tutorial-mint", body);
//       }

//       return new NextResponse(frameMetadata);
//     } catch (error) {
//       console.log(error);
//       return NextResponse.json({ error: error });
//     }
//   } else {
//     const frameMetadata = await fdk.getFrameMetadata({
//       post_url: `${process.env.BASE_URL}/redirect`,
//       buttons: [
//         { label: "Learn how to make this!", action: "post_redirect" },
//       ],
//       aspect_ratio: "1:1",
//       cid: "QmYTXErszk9Mgwn51dgYYxLo1qhfXe3v2y8DNWFcwkBjc7",
//     });
//     if (isValid) {
//       await fdk.sendAnalytics("frame-mint-tutorial-mint", body);
//     }

//     return new NextResponse(frameMetadata);
//   }
// }
