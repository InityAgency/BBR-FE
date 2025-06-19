import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClaimRequestFiles({ request, onDownload }: { request: any, onDownload: () => void }) {
  if (!request.cv) return <div className="text-muted-foreground italic">No file uploaded.</div>;
  return (
    <Card className="rounded-xl border-none bg-foreground/5">
      <CardHeader>
        <CardTitle>Request File</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4" />{request.cv.originalFileName}</div>
        <Button onClick={onDownload} variant="outline" className="w-fit"><Download className="w-4 h-4 mr-2" />Download</Button>
      </CardContent>
    </Card>
  );
} 