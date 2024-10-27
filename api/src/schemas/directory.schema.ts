import { z } from "zod";

const create = z.object({
  body: z.object({
    currentPath: z.string({
      required_error: "Current path is required.",
    }),
    directoryName: z
      .string({
        required_error: "Directory name is required.",
      })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
  }),
});

const update = z.object({
  body: z.object({
    currentPath: z.string({
      required_error: "Current path is required.",
    }),
    oldDirectoryName: z
      .string({
        required_error: "Old directory name is required.",
      })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
    newDirectoryName: z
      .string({
        required_error: "New directory name is required.",
      })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
  }),
});

const remove = z.object({
  body: z.object({
    currentPath: z.string({
      required_error: "Current path is required.",
    }),
    directoryName: z
      .string({
        required_error: "Directory name is required.",
      })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
  }),
});

export default {
  create,
  update,
  remove,
};
