import React from 'react';
import { CheckCircle, Copy, RefreshCw, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface QrResultProps {
  data: string;
  onNewScan: () => void;
  onContinue?: () => void;
}

export const QrResult: React.FC<QrResultProps> = ({ data, onNewScan, onContinue }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    toast({
      title: "Copiado",
      description: "El texto ha sido copiado al portapapeles",
    });
  };

  const isUrl = data.startsWith('http://') || data.startsWith('https://');

  return (
    <Card className="p-6 holo-border max-w-2xl mx-auto">
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <CheckCircle className="relative h-20 w-20 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text" 
              style={{backgroundImage: 'var(--gradient-primary)'}}>
            ¡Código QR Escaneado!
          </h2>
          <p className="text-muted-foreground">
            Hemos decodificado el siguiente contenido
          </p>
        </div>

        {/* Content Display */}
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-6 backdrop-blur-sm border border-neon-cyan/20">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-neon-cyan mt-1 flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-sm text-muted-foreground mb-2">Contenido decodificado:</p>
                <div className="bg-background/80 p-4 rounded-md border border-border">
                  <p className="break-all font-mono text-sm leading-relaxed">
                    {data}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Type Indicator */}
          {isUrl && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm">
              <ExternalLink className="h-3 w-3" />
              <span>Enlace detectado</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleCopy}
            variant="secondary"
            className="neon-glow"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar Texto
          </Button>

          {isUrl && (
            <Button
              onClick={() => window.open(data, '_blank')}
              variant="default"
              className="neon-glow bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Enlace
            </Button>
          )}

          <Button
            onClick={onNewScan}
            variant="outline"
            className="neon-glow"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Escanear Otro
          </Button>

          {onContinue && (
            <Button
              onClick={onContinue}
              variant="default"
              className="neon-glow bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Continuar al Juego
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            {data.length} caracteres • Escaneado el {new Date().toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </Card>
  );
};