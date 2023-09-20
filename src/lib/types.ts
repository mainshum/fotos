import { z } from "zod";

export const Photo = z.object({
  id: z.number(),
  title: z.string(),
  thumbnailUrl: z.string(),
  url: z.string(),
});

export const Photos = z.array(Photo);

export type Photos = z.infer<typeof Photos>;
