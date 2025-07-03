import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import { EyeIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  url: string;
};

export function ImagePreview({ url }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"ghost"}
          size="icon"
          className="size-8 text-foreground/60"
        >
          <EyeIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Image Preview</DialogTitle>
        <Image
          src={url}
          alt="Preview"
          layout="responsive"
          width={600}
          height={300}
          className="object-contain w-full h-full rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
}
