import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { DetailsVoyageIntegration } from './@components/DetailsVoyageIntegration';
import { MapVoyage } from './@components/Map';
import { Sidebar } from './@components/Sidebar';

export const Route = createFileRoute('/_private/voyage/voyage-integration/')({
  component: VoyageIntegrationPage,
});

function VoyageIntegrationPage() {
  return (
    <Card className="flex h-[98vh] overflow-hidden p-0">
      <CardContent className="relative flex h-full w-full p-0">
        <div className="flex h-full w-full overflow-hidden">
          {/* Asset Selection Sidebar */}
          <Sidebar />

          {/* Details Panel Overlay (managed via absolute positioning in component) */}
          <DetailsVoyageIntegration />

          {/* Map Area */}
          <MapVoyage />
        </div>
      </CardContent>
    </Card>
  );
}
