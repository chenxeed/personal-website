"use client";

import { fileUploader } from "@/service/fileUploader";
import { Source } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Admin() {
  const { data: sources, refetch } = useQuery<Source[]>({
    queryKey: ["sources"],
    queryFn: () => fetch("/api/v1/embedder").then((res) => res.json()),
  });

  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onClickDelete = (sourceId: string) => {
    const confirmed = confirm("Are you sure you want to delete this source?");
    if (!confirmed) {
      return;
    }
    setDeleting(true);

    fetch(`/api/v1/embedder/sources/${sourceId}`, { method: "DELETE" })
      .then(() => {
        refetch();
      })
      .catch(() => alert("Something went wrong. Please try again later."))
      .then(() => setDeleting(false));
  };

  const onUploadSource = async () => {
    const file = await fileUploader();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file[0]);
    formData.append("type", "mini-lm-l6-v2");

    setUploading(true);

    fetch("/api/v1/embedder", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        refetch();
      })
      .catch(() => {
        alert("Something went wrong. Please try again later.");
      })
      .then(() => setUploading(false));
  };

  return (
    <main className="flex min-h-screen max-w-screen-xl flex-col items-center justify-between lg:px-24 mx-auto">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Sources
          </h4>
          <button
            className="px-2 py-1 rounded bg-blue-500 text-gray-50"
            onClick={onUploadSource}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                ID
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                File
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Action
              </h5>
            </div>
          </div>
          {sources?.map((source) => (
            <div
              key={source._id}
              className="grid grid-cols-3 border-b border-stroke dark:border-strokedark"
            >
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{source._id}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">{source.filename}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <button
                  className="px-2 py-1 rounded bg-red-500 text-gray-50"
                  onClick={() => onClickDelete(source._id)}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
