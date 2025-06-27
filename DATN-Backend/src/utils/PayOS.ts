import { createHmac } from "crypto";

// export function createPayosSignature(data: Record<string, any>): string {
//   const sortedKeys = Object.keys(data).sort();
//   const rawData = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");
//   return createHmac(
//     "sha256",
//     "cadecea76162cde1b6b43a2f3d20ab8ae48281227dfc6a547ae4990f44362979"
//   )
//     .update(rawData)
//     .digest("hex");
// }

// export function verifyPayosSignature(
//   data: Record<string, any>,
//   signature: string
// ): boolean {
//   const generatedSig = createPayosSignature(data);
//   console.log("Generated Signature:", generatedSig);
//   console.log("Received Signature:", signature);
//   return generatedSig === signature;
// }

const CHECKSUM_KEY =
  "cadecea76162cde1b6b43a2f3d20ab8ae48281227dfc6a547ae4990f44362979"; // thay bằng process.env nếu cần

export function createPayosRequestSignature(data: Record<string, any>): string {
  const sortedKeys = Object.keys(data).sort();
  const rawData = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");

  return createHmac("sha256", CHECKSUM_KEY).update(rawData).digest("hex");
}

export function verifyPayosWebhookSignature(
  rawData: string,
  signature: string
): boolean {
  const generated = createHmac("sha256", CHECKSUM_KEY)
    .update(rawData)
    .digest("hex");

  console.log("Generated Signature:", generated);
  console.log("Received Signature:", signature);

  return generated === signature;
}
