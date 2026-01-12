import z from "zod";

export const chatSchema = z.object({
    content: z.string().min(1, "Message is required").max(500, "Message must be at most 500 characters long").transform((value) => value.trim()),
    conversationId: z.string().uuid().optional(),
});

export type TChatSchema = z.infer<typeof chatSchema>;

export const chatDefaultValues: TChatSchema = {
    content: "",
    conversationId: undefined,
};
