// Unauthenticated homepage picture slider images
const svgStringPictureSliderImageMock = `<svg xmlns="http://www.w3.org/2000/svg" width="236" height="350"><rect width="100%" height="100%" fill="#D3D3D3"/></svg>`;
const encodedSVGPictureSliderImageMock = `data:image/svg+xml;base64,${Buffer.from(
  svgStringPictureSliderImageMock
).toString("base64")}`;
export const responseSVGPictureSliderImageMock = {
  body: encodedSVGPictureSliderImageMock,
  headers: { "content-type": "image/svg+xml" },
};
