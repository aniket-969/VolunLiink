
export function makeCloudinaryUrl(originalUrl, { width, height, crop } = {}) {
 
  const mode = height ? (crop || "fill") : "scale";
  const parts = [`c_${mode}`];
  if (width)  parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  return originalUrl.replace("/upload/", `/upload/${parts.join(",")}/`);
}
