import { z } from "zod";

const upload = z.object({
  body: z.object({
    directory: z
      .string({
        required_error: "Directory is required.",
      })
      .min(1, "Directory must contain at least 1 character.")
      .max(255, "Directory cannot exceed 255 characters."),
  }),
  files: z.array(z.any()).min(1, "At least one file must be uploaded."),
  // .max(10, "A maximum of 10 files can be uploaded at once."),
});

const rename = z.object({
  body: z.object({
    directory: z
      .string({
        required_error: "Directory is required.",
      })
      .min(1, "Directory must contain at least 1 character.")
      .max(255, "Directory cannot exceed 255 characters."),
    oldFileName: z.string({
      required_error: "Old file name is required.",
    }),
    newFileName: z.string({
      required_error: "New file name is required.",
    }),
  }),
});

const remove = z.object({
  body: z.object({
    directory: z
      .string({
        required_error: "Directory is required.",
      })
      .min(1, "Directory must contain at least 1 character.")
      .max(255, "Directory cannot exceed 255 characters."),
    files: z.array(z.any()),
  }),
});

export default {
  upload,
  rename,
  remove,
};
