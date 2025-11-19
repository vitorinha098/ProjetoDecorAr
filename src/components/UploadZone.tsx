import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
}

export function UploadZone({ onImageUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-md
          flex flex-col items-center justify-center
          h-96 w-full max-w-2xl
          transition-colors
          ${isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border bg-card"
          }
        `}
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold font-serif">
              Faça upload da foto da sua divisão
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Arraste uma imagem para aqui ou clique no botão abaixo para começar a decorar
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => document.getElementById("file-input")?.click()}
              data-testid="button-upload-image"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Escolher Imagem
            </Button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file"
            />
            <p className="text-xs text-muted-foreground">
              Formatos suportados: JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
