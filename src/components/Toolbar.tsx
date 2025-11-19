import { Upload, Save, Download, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./ThemeToggle";

interface ToolbarProps {
  onUpload: () => void;
  onSave: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasImage: boolean;
  onLogout?: () => void;
}

export function Toolbar({
  onUpload,
  onSave,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasImage,
  onLogout,
}: ToolbarProps) {
  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold font-serif text-primary">DecorAR</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="default"
          onClick={onUpload}
          data-testid="button-toolbar-upload"
        >
          <Upload className="mr-2 h-4 w-4" />
          {hasImage ? "Nova Imagem" : "Upload"}
        </Button>

        {hasImage && (
          <>
            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              data-testid="button-undo"
            >
              <Undo className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              data-testid="button-redo"
            >
              <Redo className="h-5 w-5" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="default"
              onClick={onSave}
              data-testid="button-save"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>

            <Button
              variant="outline"
              onClick={onDownload}
              data-testid="button-download"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
