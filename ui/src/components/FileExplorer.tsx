"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RefreshCw,
  FolderIcon,
  FileIcon,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

export function FileExplorer() {
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
        <div className="flex-1 overflow-auto p-4">
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
    </div>
  );
}
