import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const uploadRouter = {
  identityPhoto: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userEmail: session.user.email,
        userId: (session.user as { id?: string }).id ?? "",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userEmail,
        url: file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
