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
  const pollData: any = await getPoll(pollLink); // Retrieve the poll data based on the link

  if (pollData) {
    const dateString = pollData.endDate;
    const date = new Date(dateString);

    const days = date.getUTCDate() - 1; // Subtract 1 because the day of the month starts at 1
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const formattedTime = `${days}:${hours}:${minutes}:${seconds}`;

    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/redirect`,
      buttons: pollData.choices.map((choice: any) => ({
        label: choice.value,
        action: "post_redirect",
      })),
      image: {
        url: `https://placehold.co/500x500/white/black?text=${encodeURIComponent(
          pollData.title
        )}%0A%0AEnding In : ${encodeURIComponent(formattedTime)}`,
      },
    });
    return new NextResponse(frameMetadata);
  } else {
    // Handle the case where the poll link is invalid or the poll does not exist
    return new NextResponse("Poll not found", { status: 404 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  // const body = await req.json();
  // const fid = body.untrustedData.fid;
  // const address = await getConnectedAddressForUser(fid);
  // const balance = await balanceOf(address);
  // const { isValid, message } = await fdk.validateFrameMessage(body);

  const frameMetadata = await fdk.getFrameMetadata({
    post_url: `${process.env.BASE_URL}/redirect`,
    buttons: [
      {
        label: "Want to learn more about crypto?",
        action: "post_redirect",
        target: "https://cointopper.com/",
      },
    ],
    image: {
      url: "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/",
    },
  });
  return new NextResponse(frameMetadata);

  // if (typeof balance === "number" && balance !== null && balance < 1) {
  //   try {
  //     const mint = await mintNft(address);
  //     console.log(mint);
  //     const frameMetadata = await fdk.getFrameMetadata({
  //       post_url: `${process.env.BASE_URL}/redirect`,
  //       buttons: [
  //         {
  //           label: "Want to learn more about crypto?",
  //           action: "post_redirect",
  //           target: "https://cointopper.com/",
  //         },
  //       ],
  //       image: { url: "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/" },
  //     });

  //     return new NextResponse(frameMetadata);
  //   } catch (error) {
  //     console.log(error);
  //     return NextResponse.json({ error: error });
  //   }
  // } else {
  //   const frameMetadata = await fdk.getFrameMetadata({
  //     post_url: `${process.env.BASE_URL}/redirect`,
  //     buttons: [
  //       {
  //         label: "Want to learn more about crypto?",
  //         action: "post_redirect",
  //         target: "https://cointopper.com/",
  //       },
  //     ],
  //     image: { url: "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/" },
  //   });

  //   return new NextResponse(frameMetadata);
  // }
}
