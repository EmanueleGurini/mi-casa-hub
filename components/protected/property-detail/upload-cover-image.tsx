"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Loader2 as SpinnerIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const UploadCarouselImage: React.FC<{ id: string }> = (props) => {
  const { toast } = useToast();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    startTransition(async () => {
      if (selectedFiles.length === 0) {
        toast({
          title: "Upload Error",
          description: "No files selected",
        });
        return;
      }

      for (const file of selectedFiles) {
        const {
          data: { user },
        } = await createClient().auth.getUser();
        const { data, error } = await createClient()
          .storage.from("cover-image")
          .upload(`${user?.id}/${props.id}/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast({
            title: "Upload Error",
            description: error.message,
          });
          setSelectedFiles([]);
        } else {
          toast({
            title: "Upload notice",
            description: "File uploaded succesfully",
          });
        }
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-400 hover:file:bg-slate-100"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={isPending || selectedFiles.length <= 0}
                className="w-full"
              >
                {isPending ? (
                  <SpinnerIcon className="h-6 w-6 animate-spin" />
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UploadCarouselImage;
