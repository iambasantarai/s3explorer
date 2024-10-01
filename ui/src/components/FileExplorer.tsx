import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RefreshCw,
  FolderIcon,
  FolderPlusIcon,
  FileUpIcon,
  FileIcon,
  ChevronDown,
  TrashIcon,
  FileDownIcon,
  EditIcon,
} from "lucide-react";

export default function FileExplorer() {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    },
    [contextMenu],
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r overflow-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">S3 Explorer</h2>
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FolderIcon className="h-4 w-4 mr-2" />
                scripts
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FolderIcon className="h-4 w-4 mr-2" />
                front-end
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <ChevronDown className="h-4 w-4 mr-2" />
                Web assets
              </Button>
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    logs
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    testfolder
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileIcon className="h-4 w-4 mr-2" />
                    public_html
                  </Button>
                </li>
              </ul>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FolderIcon className="h-4 w-4 mr-2" />
                backup_files
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FolderIcon className="h-4 w-4 mr-2" />
                others
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FolderIcon className="h-4 w-4 mr-2" />
                New folder
              </Button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Path and search */}
        <div className="bg-white border-b p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Input
              className="w-full sm:w-96"
              placeholder="Path: /public_html/files/Web assets/"
            />
          </div>
          <Input className="w-full sm:w-64" placeholder="Search" />
        </div>

        {/* File list */}
        <div
          className="flex-1 overflow-auto p-4"
          onContextMenu={handleContextMenu}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead className="w-[25%]">Last modified</TableHead>
                <TableHead className="w-[15%]">Permission</TableHead>
                <TableHead className="w-[20%]">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <FolderIcon className="h-4 w-4 inline-block mr-2" />
                  logs
                </TableCell>
                <TableCell>16/9/2023 5:54 am</TableCell>
                <TableCell>777</TableCell>
                <TableCell>167 KB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <FolderIcon className="h-4 w-4 inline-block mr-2" />
                  testfolder
                </TableCell>
                <TableCell>4/12/2023 5:54 am</TableCell>
                <TableCell>777</TableCell>
                <TableCell>7 MB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <FileIcon className="h-4 w-4 inline-block mr-2" />
                  public_html
                </TableCell>
                <TableCell>26/1/2023 7:20 pm</TableCell>
                <TableCell>567</TableCell>
                <TableCell>76 KB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <FileIcon className="h-4 w-4 inline-block mr-2" />
                  testfile.txt
                </TableCell>
                <TableCell>26/1/2023 5:54 am</TableCell>
                <TableCell>655</TableCell>
                <TableCell>167 KB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <FileIcon className="h-4 w-4 inline-block mr-2" />
                  localhost.sql
                </TableCell>
                <TableCell>26/1/2023 5:54 am</TableCell>
                <TableCell>777</TableCell>
                <TableCell>8 KB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <FileIcon className="h-4 w-4 inline-block mr-2" />
                  index.html
                </TableCell>
                <TableCell>26/1/2023 1:32 pm</TableCell>
                <TableCell>777</TableCell>
                <TableCell>180 KB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <FileIcon className="h-4 w-4 inline-block mr-2" />
                  about.php
                </TableCell>
                <TableCell>14/7/2018 2:01 pm</TableCell>
                <TableCell>777</TableCell>
                <TableCell>167 KB</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white shadow-md rounded-md p-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul className="space-y-1">
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <FolderPlusIcon className="h-4 w-4 mr-2" />
                Add directory
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <FileUpIcon className="h-4 w-4 mr-2" />
                Upload file
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <FileDownIcon className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <EditIcon className="h-4 w-4 mr-2" />
                Rename
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
