import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-6">
            <Link href="/">
              <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                <HomeIcon className="h-4 w-4" />
                Return to Home
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}