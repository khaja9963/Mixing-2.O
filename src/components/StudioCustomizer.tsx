import React, { useState } from 'react';
import type { SliderCard, SpiralConfig } from '../data/sliderData';
import { RotateCw, Eye, EyeOff, Image as ImageIcon, Plus, Trash2, Settings } from 'lucide-react';

interface StudioCustomizerProps {
  config: SpiralConfig;
  onChangeConfig: (newConfig: SpiralConfig) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  cards: SliderCard[];
  onUpdateCards: (newCards: SliderCard[]) => void;
}

export const StudioCustomizer: React.FC<StudioCustomizerProps> = ({
  config,
  onChangeConfig,
  onReset,
  isOpen,
  onToggleOpen,
  cards,
  onUpdateCards,
}) => {
  const [activeTab, setActiveTab] = useState<'params' | 'cards'>('params');

  const updateProp = <K extends keyof SpiralConfig>(key: K, value: SpiralConfig[K]) => {
    onChangeConfig({
      ...config,
      [key]: value,
    });
  };

  const handleCardImageChange = (cardId: string, newUrl: string) => {
    const updated = cards.map((c) => (c.id === cardId ? { ...c, imageUrl: newUrl } : c));
    onUpdateCards(updated);
  };

  const handleCardTitleChange = (cardId: string, newTitle: string) => {
    const updated = cards.map((c) => (c.id === cardId ? { ...c, title: newTitle } : c));
    onUpdateCards(updated);
  };

  const handleDeleteCard = (cardId: string) => {
    if (cards.length <= 3) return; // Keep at least 3 cards for spiral
    const updated = cards.filter((c) => c.id !== cardId);
    onUpdateCards(updated);
  };

  const handleAddCard = () => {
    const newId = `card-${Date.now()}`;
    const newCard: SliderCard = {
      id: newId,
      title: `CUSTOM PRESET #${cards.length + 1}`,
      category: 'cyberpunk',
      subtitle: 'User Custom Deck',
      description: 'Custom user added card in the 3D spiral slider.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
      accentColor: '#0284c7',
      tags: ['Custom Image', '3D Helix'],
      pageRoute: 'AI',
      prompt: 'Custom user spiral card prompt.',
      stats: { fps: 60, depth: 'Z-sorted', vertices: '5.0k', downloads: '100' },
    };
    onUpdateCards([...cards, newCard]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 transition-all duration-300 w-auto sm:w-96 max-h-[85vh] flex flex-col">

      {/* Expanded Controls Drawer */}
      {isOpen && (
        <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-2xl text-slate-900 max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('params')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'params'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> 3D Specs
              </button>

              <button
                onClick={() => setActiveTab('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'cards'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Images ({cards.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'params' && (
                <button
                  onClick={onReset}
                  className="text-xs text-slate-500 hover:text-sky-600 transition-colors"
                  title="Reset to default spiral specs"
                >
                  Reset
                </button>
              )}
              <button
                onClick={onToggleOpen}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all text-xs font-mono"
              >
                ✕
              </button>
            </div>
          </div>

          {activeTab === 'params' ? (
            <div className="flex flex-col gap-3.5 max-h-[55vh] sm:max-h-[480px] overflow-y-auto pr-1 text-xs">
              {/* Radius Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Helix Radius</span>
                  <span className="font-mono text-sky-600 font-bold">{config.radius}px</span>
                </div>
                <input
                  type="range"
                  min={180}
                  max={480}
                  value={config.radius}
                  onChange={(e) => updateProp('radius', Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Pitch Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Vertical Pitch (Height)</span>
                  <span className="font-mono text-sky-600 font-bold">{config.pitch}px</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={110}
                  value={config.pitch}
                  onChange={(e) => updateProp('pitch', Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Tightness Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Spiral Rotations</span>
                  <span className="font-mono text-sky-600 font-bold">{config.tightness}x</span>
                </div>
                <input
                  type="range"
                  min={0.6}
                  max={3.0}
                  step={0.1}
                  value={config.tightness}
                  onChange={(e) => updateProp('tightness', Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Stage Tilt Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Tilt Angle</span>
                  <span className="font-mono text-sky-600 font-bold">{config.tiltAngle}°</span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={config.tiltAngle}
                  onChange={(e) => updateProp('tiltAngle', Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Perspective Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Camera Perspective</span>
                  <span className="font-mono text-sky-600 font-bold">{config.perspective}px</span>
                </div>
                <input
                  type="range"
                  min={700}
                  max={2200}
                  step={50}
                  value={config.perspective}
                  onChange={(e) => updateProp('perspective', Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Glass Blur Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Frosted Glass Depth</span>
                  <span className="font-mono text-sky-600 font-bold">{config.glassBlur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={config.glassBlur}
                  onChange={(e) => updateProp('glassBlur', Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-slate-700 font-medium">Card Aspect Ratio</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['portrait', 'landscape', 'square'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => updateProp('aspectRatio', ratio)}
                      className={`py-1.5 rounded-lg border text-[11px] font-semibold capitalize transition-all ${
                        config.aspectRatio === ratio
                          ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Rotation & Speed */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-sky-600" /> Continuous Auto-Spin
                  </span>
                  <button
                    onClick={() => updateProp('autoRotate', !config.autoRotate)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      config.autoRotate
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {config.autoRotate ? 'ON' : 'OFF'}
                  </button>
                </div>

                {config.autoRotate && (
                  <div className="flex flex-col gap-1 pl-2">
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Spin Speed</span>
                      <span className="font-mono text-sky-600 font-bold">{config.rotationSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      value={config.rotationSpeed}
                      onChange={(e) => updateProp('rotationSpeed', Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Toggle Far side visibility */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  {config.visibleFarCards ? <Eye className="w-3.5 h-3.5 text-sky-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  Frosted Backside Visibility
                </span>
                <button
                  onClick={() => updateProp('visibleFarCards', !config.visibleFarCards)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    config.visibleFarCards
                      ? 'bg-sky-100 border border-sky-400 text-sky-800'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {config.visibleFarCards ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          ) : (
            /* Cards & Images Manager Tab */
            <div className="flex flex-col gap-3 max-h-[55vh] sm:max-h-[480px] overflow-y-auto pr-1 text-xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-600 font-medium">Edit Card Images & Titles Live</span>
                <button
                  onClick={handleAddCard}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all text-[11px] shadow-sm"
                >
                  <Plus className="w-3 h-3" /> Add Card
                </button>
              </div>

              {cards.map((card, idx) => (
                <div key={card.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-sky-600 font-semibold">
                      CARD #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-200 transition-all"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-300 shrink-0 shadow-sm"
                    />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardTitleChange(card.id, e.target.value)}
                        placeholder="Card Title"
                        className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-slate-900 text-[11px] focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="text"
                        value={card.imageUrl}
                        onChange={(e) => handleCardImageChange(card.id, e.target.value)}
                        placeholder="Image URL (https://...)"
                        className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-slate-600 text-[10px] font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
