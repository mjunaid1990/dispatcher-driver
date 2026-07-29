import Button from "~/components/ui/Button";
import StatusPill from "~/components/ui/StatusPill";
import Input from "~/components/ui/Input";
import Toggle from "~/components/ui/Toggle";
import DeliveryCard from "~/components/delivery/DeliveryCard";
import ProgressCard from "~/components/delivery/ProgressCard";
import { Plus, Search, Bell, Settings, Menu, X, Check, ChevronRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="bg-surface-card border-b border-surface-elevated sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-base font-bold text-base">D</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Dispatcher Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="icon" size="sm">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="icon" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="icon" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 shadow-glow-strong">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Design System Showcase
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl">
              Neon Mint palette with semantic tokens, comprehensive component library, 
              and modern UI patterns for the dispatcher dashboard.
            </p>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Typography Scale
          </h3>
          <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated space-y-4">
            <div>
              <p className="font-display text-6xl font-bold text-white mb-2">Display</p>
              <p className="text-sm text-gray-500">Space Grotesk - 60px</p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-white mb-2">Heading 1</p>
              <p className="text-sm text-gray-500">Space Grotesk - 48px</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-white mb-2">Heading 2</p>
              <p className="text-sm text-gray-500">Space Grotesk - 36px</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-white mb-2">Heading 3</p>
              <p className="text-sm text-gray-500">Space Grotesk - 30px</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white mb-2">Heading 4</p>
              <p className="text-sm text-gray-500">Space Grotesk - 24px</p>
            </div>
            <div>
              <p className="font-body text-xl font-semibold text-white mb-2">Large Body</p>
              <p className="text-sm text-gray-500">Inter - 20px</p>
            </div>
            <div>
              <p className="font-body text-lg text-white mb-2">Body Large</p>
              <p className="text-sm text-gray-500">Inter - 18px</p>
            </div>
            <div>
              <p className="font-body text-base text-white mb-2">Body Base</p>
              <p className="text-sm text-gray-500">Inter - 16px</p>
            </div>
            <div>
              <p className="font-body text-sm text-white mb-2">Body Small</p>
              <p className="text-sm text-gray-500">Inter - 14px</p>
            </div>
            <div>
              <p className="font-body text-xs text-white mb-2">Caption</p>
              <p className="text-sm text-gray-500">Inter - 12px</p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Neon Mint Palette
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="Base" color="#0d1b2a" />
            <ColorSwatch name="Base Light" color="#1a2d3d" />
            <ColorSwatch name="Mint" color="#2dd4a8" />
            <ColorSwatch name="Mint Light" color="#4ce0ba" />
            <ColorSwatch name="Glow" color="#73ffb8" />
            <ColorSwatch name="Success" color="#2dd4a8" />
            <ColorSwatch name="Warning" color="#fbbf24" />
            <ColorSwatch name="Error" color="#ef4444" />
            <ColorSwatch name="Info" color="#60a5fa" />
            <ColorSwatch name="Surface" color="#1a2d3d" />
            <ColorSwatch name="Surface Elevated" color="#263f52" />
            <ColorSwatch name="Surface Card" color="#1e3244" />
          </div>
        </section>

        {/* Gradients */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Gradients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GradientCard name="Primary" className="bg-gradient-primary" />
            <GradientCard name="Surface" className="bg-gradient-surface" />
            <GradientCard name="Hero" className="bg-gradient-hero" />
          </div>
        </section>

        {/* Spacing & Radius */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Spacing & Radius
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated">
              <h4 className="font-display text-lg font-semibold text-white mb-4">4px Grid</h4>
              <div className="space-y-3">
                <SpacingBox label="4px" size="4" />
                <SpacingBox label="8px" size="8" />
                <SpacingBox label="16px" size="16" />
                <SpacingBox label="24px" size="24" />
                <SpacingBox label="32px" size="32" />
              </div>
            </div>
            <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated">
              <h4 className="font-display text-lg font-semibold text-white mb-4">Radius Scale</h4>
              <div className="space-y-3">
                <RadiusBox label="sm (4px)" radius="rounded-sm" />
                <RadiusBox label="md (8px)" radius="rounded-md" />
                <RadiusBox label="lg (12px)" radius="rounded-lg" />
                <RadiusBox label="xl (16px)" radius="rounded-xl" />
                <RadiusBox label="2xl (24px)" radius="rounded-2xl" />
                <RadiusBox label="full" radius="rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Elevation */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Elevation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ElevationCard level="1" className="shadow-elevation-1" />
            <ElevationCard level="2" className="shadow-elevation-2" />
            <ElevationCard level="3" className="shadow-elevation-3" />
            <ElevationCard level="4" className="shadow-elevation-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ElevationCard level="Glow" className="shadow-glow" />
            <ElevationCard level="Glow Strong" className="shadow-glow-strong" />
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Buttons
          </h3>
          <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Primary</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Secondary</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Outline</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="md">Medium</Button>
                <Button variant="outline" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Ghost</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Destructive</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="destructive" size="sm">Small</Button>
                <Button variant="destructive" size="md">Medium</Button>
                <Button variant="destructive" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Icon</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="icon" size="sm"><Plus className="w-4 h-4" /></Button>
                <Button variant="icon" size="md"><Search className="w-5 h-5" /></Button>
                <Button variant="icon" size="lg"><Menu className="w-6 h-6" /></Button>
              </div>
            </div>
          </div>
        </section>

        {/* Status Pills */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Status Pills
          </h3>
          <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated space-y-4">
            <div className="flex flex-wrap gap-3">
              <StatusPill status="pending" size="sm" />
              <StatusPill status="assigned" size="sm" />
              <StatusPill status="in_transit" size="sm" />
              <StatusPill status="arrived" size="sm" />
              <StatusPill status="delivered" size="sm" />
              <StatusPill status="failed" size="sm" />
              <StatusPill status="cancelled" size="sm" />
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusPill status="pending" size="md" />
              <StatusPill status="assigned" size="md" />
              <StatusPill status="in_transit" size="md" />
              <StatusPill status="arrived" size="md" />
              <StatusPill status="delivered" size="md" />
              <StatusPill status="failed" size="md" />
              <StatusPill status="cancelled" size="md" />
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusPill status="pending" size="lg" />
              <StatusPill status="assigned" size="lg" />
              <StatusPill status="in_transit" size="lg" />
              <StatusPill status="arrived" size="lg" />
              <StatusPill status="delivered" size="lg" />
              <StatusPill status="failed" size="lg" />
              <StatusPill status="cancelled" size="lg" />
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Inputs
          </h3>
          <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated space-y-6">
            <Input label="Default Input" placeholder="Enter text..." />
            <Input label="With Error" placeholder="Enter text..." error="This field is required" />
            <Input label="With Helper Text" placeholder="Enter text..." helperText="This is helper text" />
            <Input label="Disabled" placeholder="Disabled input" disabled />
          </div>
        </section>

        {/* Toggles */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Toggles
          </h3>
          <div className="bg-surface-card rounded-xl p-6 border border-surface-elevated space-y-4">
            <div className="flex items-center gap-6">
              <Toggle size="sm" label="Small" />
              <Toggle size="md" label="Medium" defaultChecked />
              <Toggle size="lg" label="Large" />
            </div>
          </div>
        </section>

        {/* Delivery Cards */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Delivery Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DeliveryCard
              id="12345"
              customerName="John Doe"
              customerPhone="+1234567890"
              pickupAddress="123 Main St, Downtown"
              dropoffAddress="456 Oak Ave, Suburb"
              status="pending"
              estimatedTime="15 min"
              earnings={12.50}
              distance="3.2 km"
            />
            <DeliveryCard
              id="12346"
              customerName="Jane Smith"
              pickupAddress="789 Pine Rd, City Center"
              dropoffAddress="321 Elm St, Westside"
              status="in_transit"
              estimatedTime="20 min"
              earnings={15.00}
              distance="5.1 km"
              driverName="Mike Johnson"
            />
            <DeliveryCard
              id="12347"
              customerName="Bob Johnson"
              pickupAddress="555 Maple Dr, Northgate"
              dropoffAddress="888 Cedar Ln, Southpark"
              status="delivered"
              estimatedTime="25 min"
              earnings={18.50}
              distance="4.8 km"
              driverName="Sarah Williams"
            />
            <DeliveryCard
              id="12348"
              customerName="Alice Brown"
              pickupAddress="999 Beach Blvd, Coastline"
              dropoffAddress="111 Mountain Rd, Highlands"
              status="failed"
              estimatedTime="30 min"
              earnings={22.00}
              distance="8.2 km"
            />
          </div>
        </section>

        {/* Progress Card */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-primary rounded-full" />
            Progress Card
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressCard currentStep={0} />
            <ProgressCard currentStep={1} />
            <ProgressCard currentStep={2} />
            <ProgressCard currentStep={4} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-card border-t border-surface-elevated py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Dispatcher Dashboard Design System • Neon Mint Palette
          </p>
        </div>
      </footer>
    </div>
  );
}

function ColorSwatch({ name, color }: { name: string; color: string }) {
  return (
    <div className="space-y-2">
      <div
        className="w-full aspect-square rounded-lg shadow-elevation-1"
        style={{ backgroundColor: color }}
      />
      <p className="text-xs text-gray-400 text-center">{name}</p>
      <p className="text-xs text-gray-500 text-center font-mono">{color}</p>
    </div>
  );
}

function GradientCard({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`w-full aspect-square rounded-lg shadow-elevation-2 ${className}`} />
      <p className="text-sm text-gray-400 text-center">{name}</p>
    </div>
  );
}

function SpacingBox({ label, size }: { label: string; size: number }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="bg-mint rounded"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
}

function RadiusBox({ label, radius }: { label: string; radius: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`bg-mint w-12 h-12 ${radius}`} />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
}

function ElevationCard({ level, className }: { level: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`w-full aspect-square bg-surface-card rounded-lg ${className}`} />
      <p className="text-sm text-gray-400 text-center">{level}</p>
    </div>
  );
}
