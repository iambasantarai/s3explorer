import { object, string } from "zod";

const create = object({
  body: object({
    currentPath: string({
      required_error: "Current path is required.",
    }),
    directoryName: string({
      required_error: "Directory name is required.",
    })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
  }),
});

const update = object({
  body: object({
    currentPath: string({
      required_error: "Current path is required.",
    }),
    oldDirectoryName: string({
      required_error: "Old directory name is required.",
    })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
    newDirectoryName: string({
      required_error: "New directory name is required.",
    })
      .min(1, "Directory name must contain at least 1 character.")
      .max(255, "Directory name cannot exceed 255 characters.")
      .regex(/^[^<>:"/\\|?*]+$/, "Directory name contains invalid characters."),
  }),
});

const remove = object({
  body: object({
    currentPath: string({
      required_error: "Current path is required.",
    }),
    directoryName: string({
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
