import { SignoutButton } from "@/features/auth/components/signout-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { BellIcon, SchoolIcon, SettingsIcon } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <SchoolIcon className="size-5" />
          </div>
          <span className="font-heading text-primary/90 font-bold h-4 flex items-center gap-1">
            MyUnivrs
            <Separator orientation="vertical" />
            <span className="font-normal">Student</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <BellIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/avatars/john-doe.jpg" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground">
                john@university.edu
              </div>
            </div>
            <SignoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
