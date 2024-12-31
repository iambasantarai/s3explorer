export type MimeType = {
  type: string;
  name: string;
};

export type ListAllObjectsParams = {
  nextRootDirectory: string;
  continuationToken?: string;
  maxKeys?: string;
};

export type FileObject = {
  basename: string;
  type: "file";
  path: string;
  modifiedAt: number | null;
  size: number;
  mimeType: MimeType;
};

export type DirectoryObject = {
  basename: string;
  type: "directory";
  path: string;
};

export type ListAllObjectsResult = {
  data: (DirectoryObject | FileObject)[];
  currentPath: string;
  continuationToken?: string;
  isTruncated: boolean;
};
