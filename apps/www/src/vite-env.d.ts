/// <reference types="vite/client" />

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.mkv" {
  const src: string;
  export default src;
}

declare module "*.mkv?url" {
  const src: string;
  export default src;
}
