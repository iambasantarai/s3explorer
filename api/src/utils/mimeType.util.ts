export interface MimeType {
  type: string;
  name: string;
}

const defaultMimeType: MimeType = {
  type: "binary/octet-stream",
  name: "Default",
};

const mimeTypesMap = new Map<string, MimeType>([
  // Text Formats
  [".csv", { type: "text/csv", name: "Comma-Separated Values" }],
  [".txt", { type: "text/plain", name: "Text File" }],
  [".html", { type: "text/html", name: "HTML File" }],
  [".css", { type: "text/css", name: "Cascading Style Sheets" }],
  [".xml", { type: "application/xml", name: "Extensible Markup Language" }],
  [".json", { type: "application/json", name: "JSON File" }],

  // Document Formats
  [".doc", { type: "application/msword", name: "Microsoft Word" }],
  [
    ".docx",
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "Microsoft Word (OOXML)",
    },
  ],
  [".pdf", { type: "application/pdf", name: "Adobe PDF" }],
  [
    ".odt",
    {
      type: "application/vnd.oasis.opendocument.text",
      name: "OpenDocument Text",
    },
  ],
  [".rtf", { type: "application/rtf", name: "Rich Text Format" }],

  // Spreadsheet Formats
  [".xls", { type: "application/vnd.ms-excel", name: "Microsoft Excel" }],
  [
    ".xlsx",
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      name: "Microsoft Excel (OOXML)",
    },
  ],
  [
    ".ods",
    {
      type: "application/vnd.oasis.opendocument.spreadsheet",
      name: "OpenDocument Spreadsheet",
    },
  ],

  // Presentation Formats
  [
    ".ppt",
    { type: "application/vnd.ms-powerpoint", name: "Microsoft PowerPoint" },
  ],
  [
    ".pptx",
    {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      name: "Microsoft PowerPoint (OOXML)",
    },
  ],
  [
    ".odp",
    {
      type: "application/vnd.oasis.opendocument.presentation",
      name: "OpenDocument Presentation",
    },
  ],

  // Image Formats
  [".jpeg", { type: "image/jpeg", name: "JPEG Image" }],
  [".jpg", { type: "image/jpeg", name: "JPEG Image" }],
  [".png", { type: "image/png", name: "Portable Network Graphics" }],
  [".gif", { type: "image/gif", name: "GIF Image" }],
  [".bmp", { type: "image/bmp", name: "Bitmap Image" }],
  [".svg", { type: "image/svg+xml", name: "Scalable Vector Graphics" }],

  // Audio Formats
  [".mp3", { type: "audio/mpeg", name: "MPEG Audio" }],
  [".mpga", { type: "audio/mpeg", name: "MPEG Audio" }],
  [".wav", { type: "audio/wav", name: "Waveform Audio" }],
  [".ogg", { type: "audio/ogg", name: "Ogg Vorbis Audio" }],
  [".m4a", { type: "audio/mp4", name: "MPEG-4 Audio" }],

  // Video Formats
  [".mp4", { type: "video/mp4", name: "MPEG-4 Video" }],
  [".avi", { type: "video/x-msvideo", name: "AVI Video" }],
  [".mov", { type: "video/quicktime", name: "QuickTime Movie" }],
  [".wmv", { type: "video/x-ms-wmv", name: "Windows Media Video" }],
  [".flv", { type: "video/x-flv", name: "Flash Video" }],

  // Compressed and Archive Formats
  [".zip", { type: "application/zip", name: "ZIP Archive" }],
  [".tar", { type: "application/x-tar", name: "TAR Archive" }],
  [".gz", { type: "application/gzip", name: "GZIP Compressed File" }],
  [".rar", { type: "application/vnd.rar", name: "RAR Archive" }],
  [".7z", { type: "application/x-7z-compressed", name: "7-Zip Archive" }],

  // Application/Executable Formats
  [
    ".exe",
    {
      type: "application/vnd.microsoft.portable-executable",
      name: "Windows Executable",
    },
  ],
  [
    ".apk",
    {
      type: "application/vnd.android.package-archive",
      name: "Android Package",
    },
  ],
  [".bin", { type: "application/octet-stream", name: "Binary File" }],
  [".iso", { type: "application/x-iso9660-image", name: "ISO Disk Image" }],

  // Font Formats
  [".ttf", { type: "font/ttf", name: "TrueType Font" }],
  [".woff", { type: "font/woff", name: "Web Open Font Format" }],
  [".woff2", { type: "font/woff2", name: "Web Open Font Format 2" }],
  [".otf", { type: "font/otf", name: "OpenType Font" }],

  // Script and Code Files
  [".js", { type: "application/javascript", name: "JavaScript File" }],
  [".ts", { type: "application/typescript", name: "TypeScript File" }],
  [".sh", { type: "application/x-sh", name: "Shell Script" }],
  [".php", { type: "application/x-httpd-php", name: "PHP Script" }],
  [".c", { type: "text/x-c", name: "C Source File" }],

  // Others
  [".ics", { type: "text/calendar", name: "iCalendar File" }],
  [".vcf", { type: "text/x-vcard", name: "vCard File" }],
]);

export function getMimeType(filename: string): MimeType {
  const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  return mimeTypesMap.get(extension) ?? defaultMimeType;
}
