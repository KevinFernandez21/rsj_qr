import React, { useState } from 'react';
import { QRScanner } from './QRScanner';
import { QrResult } from './QrResult';
import { ContentDisplay } from './ContentDisplay';
import { NavigationMenu } from './NavigationMenu';
import { Timer } from './Timer';
import { FinalPasswordPanel } from './FinalPasswordPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';
import { 
  Menu, 
  X, 
  RotateCcw, 
  Zap,
  Shield,
  Cpu
} from 'lucide-react';

export const EscapeRoom: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [finalDoorUnlocked, setFinalDoorUnlocked] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showScanResult, setShowScanResult] = useState(false);
  
  const {
    discoveredContent,
    currentContent,
    isGameStarted,
    gameTime,
    processQRCode,
    solveRiddle,
    markAsFound,
    selectContent,
    resetGame
  } = useGameState();

  const handleQRScan = (qrData: string) => {
    // Primero mostrar el resultado del escaneo
    setScanResult(qrData);
    setShowScanResult(true);
  };

  const processScanResult = () => {
    if (!scanResult) return;
    
    const content = processQRCode(scanResult);
    
    if (content) {
      toast({
        title: `${content.type === 'hint' ? 'Pista' : content.type === 'riddle' ? 'Acertijo' : 'Huevo de Pascua'} Encontrado!`,
        description: content.title,
      });
      setShowMenu(false);
    } else {
      toast({
        title: "Código QR No Reconocido",
        description: "Este código no pertenece al escape room",
        variant: "destructive",
      });
    }
    
    // Limpiar el resultado del escaneo después de procesarlo
    setScanResult(null);
    setShowScanResult(false);
  };

  const handleNewScan = () => {
    setScanResult(null);
    setShowScanResult(false);
  };

  const handleReset = () => {
    resetGame();
    setFinalDoorUnlocked(false);
    setScanResult(null);
    setShowScanResult(false);
    toast({
      title: "Juego Reiniciado",
      description: "Tu progreso ha sido borrado",
    });
  };

  const handleFinalUnlock = () => {
    setFinalDoorUnlocked(true);
  };

  // Determinar si mostrar el panel de contraseña final
  const shouldShowPasswordPanel = discoveredContent.length >= 3;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-neon-cyan" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text"
                style={{backgroundImage: 'var(--gradient-primary)'}}>
              QR Escape Verse
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="relative"
            >
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              {discoveredContent.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-neon-orange rounded-full" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Timer Display */}
            <Timer 
              isGameStarted={isGameStarted}
              onTimeUpdate={(time) => {}}
            />
            
            {/* Show QR Result if scanned */}
            {showScanResult && scanResult ? (
              <QrResult 
                data={scanResult} 
                onNewScan={handleNewScan}
                onContinue={processScanResult}
              />
            ) : (
              <>
                {/* Welcome Card - Only show if no content discovered */}
                

                {/* QR Scanner */}
                <QRScanner onScanResult={handleQRScan} />
                
                {/* Content Display */}
                <ContentDisplay
                  content={currentContent}
                  onSolveRiddle={solveRiddle}
                  onMarkFound={markAsFound}
                />

                {/* Final Password Panel */}
                <FinalPasswordPanel
                  isVisible={shouldShowPasswordPanel}
                  isUnlocked={finalDoorUnlocked}
                  onUnlock={handleFinalUnlock}
                />
              </>
            )}
          </div>

          {/* Navigation Menu - Desktop */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24">
              <NavigationMenu
                content={discoveredContent}
                onSelectContent={selectContent}
                selectedContent={currentContent}
              />
            </div>
          </div>

          {/* Navigation Menu - Mobile Overlay */}
          {showMenu && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="absolute top-16 left-0 right-0 bottom-0 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                  <NavigationMenu
                    content={discoveredContent}
                    onSelectContent={(content) => {
                      selectContent(content);
                      setShowMenu(false);
                    }}
                    selectedContent={currentContent}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};