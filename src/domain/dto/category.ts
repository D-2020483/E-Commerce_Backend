import { z } from "zod";

export const categoryDTO = z.object({
    name:z.string(),
});