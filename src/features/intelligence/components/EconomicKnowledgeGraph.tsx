import React, { useState } from 'react';
import { 
  KNOWLEDGE_GRAPH_NODES, 
  KNOWLEDGE_GRAPH_LINKS 
} from '../data';
import { 
  GraphNode
} from '../types';
import { 
  ArrowRight, 
  Globe, 
  Activity,
  Workflow
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function EconomicKnowledgeGraph() {
  const { lang } = useSettingsStore();
  const isKurdish = lang === 'ku';

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(KNOWLEDGE_GRAPH_NODES[0]);

  // Trace inputs: get all nodes that either depend on this node, or are depended on by this node
  const getConnectedDetails = (nodeId: string) => {
    const incoming = KNOWLEDGE_GRAPH_LINKS.filter(l => l.target === nodeId);
    const outgoing = KNOWLEDGE_GRAPH_LINKS.filter(l => l.source === nodeId);
    return { incoming, outgoing };
  };

  const { incoming, outgoing } = selectedNode ? getConnectedDetails(selectedNode.id) : { incoming: [], outgoing: [] };

  // Coordinates mapping for rendering an interactive 2D Graph cleanly in pure SVG/CSS
  // This avoids d3 package clutter while providing a flawless, pixel-perfect layout
  const getNodeCoordinates = (id: string) => {
    const coords: Record<string, { x: number; y: number }> = {
      'n-1': { x: 100, y: 150 },  // Um Qasr Port
      'n-2': { x: 440, y: 150 },  // Ibrahim Khalil Border
      'n-3': { x: 220, y: 100 },  // Basra Customs
      'n-4': { x: 270, y: 220 },  // Dry Canal Corridor
      'n-5': { x: 80,  y: 280 },  // Steel Sheets commodity
      'n-6': { x: 380, y: 80  },  // ASYCUDA
      'n-7': { x: 450, y: 280 }   // Ministry of Trade
    };
    return coords[id] || { x: 150, y: 150 };
  };

  const isConnected = (nodeId1: string, nodeId2: string) => {
    return KNOWLEDGE_GRAPH_LINKS.some(
      l => (l.source === nodeId1 && l.target === nodeId2) || (l.source === nodeId2 && l.target === nodeId1)
    );
  };

  return (
    <div id="economic-knowledge-graph" className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 space-y-5">
      
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isKurdish ? 'تۆڕی زانیاری ئابووری (Economic Knowledge Graph)' : 'خارطة العلاقات الجيوسياسية والتجارة الجمركية'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isKurdish ? 'نیگارکێشانی پەیوەندی نێوان بەندەر، گومرگ، کاڵا و بڕیارە مەنەفیستیەکان' : 'نظام تتبع الترابط المؤسسي، المنافذ، السلع اللوجستية، والسياسات الاتحادیة'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Graph Display */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-[20px] p-4 relative min-h-[300px] flex items-center justify-center overflow-hidden">
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 text-[9px] font-bold text-slate-400 uppercase select-none z-10">
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              {isKurdish ? 'بەندەر / دەروازە' : 'منفذ / ميناء'}
            </span>
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
              {isKurdish ? 'خانەی گومرگ' : 'مقر جمرك'}
            </span>
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {isKurdish ? 'ڕێڕەو' : 'ممر بري'}
            </span>
          </div>

          <svg className="w-full h-full min-h-[320px] max-h-[400px]" viewBox="0 0 550 340">
            {/* Draw Relationship Links */}
            {KNOWLEDGE_GRAPH_LINKS.map((link, idx) => {
              const start = getNodeCoordinates(link.source);
              const end = getNodeCoordinates(link.target);
              
              const isSelectedSource = selectedNode?.id === link.source || selectedNode?.id === link.target;
              
              return (
                <g key={idx}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    className={`transition-all duration-300 ${
                      isSelectedSource 
                        ? 'stroke-indigo-500 stroke-[2.2]' 
                        : 'stroke-slate-200 stroke-[1.2] stroke-dasharray-[2, 3]'
                    }`}
                  />
                  {/* Subtle directional arrow along line */}
                  <circle 
                    cx={(start.x + end.x) / 2} 
                    cy={(start.y + end.y) / 2} 
                    r="3" 
                    className={isSelectedSource ? 'fill-indigo-500 opacity-90' : 'fill-slate-300 opacity-60'}
                  />
                </g>
              );
            })}

            {/* Draw Nodes */}
            {KNOWLEDGE_GRAPH_NODES.map((node, idx) => {
              const pos = getNodeCoordinates(node.id);
              const isSelected = selectedNode?.id === node.id;
              
              // Highlight node if it is connected to the selected node
              const isHighlighted = isSelected || (selectedNode && isConnected(selectedNode.id, node.id));

              // Type Colors mapping
              const getNodeStyles = () => {
                switch(node.type) {
                  case 'port': return 'fill-blue-600 ring-blue-100 bg-blue-50 text-blue-700';
                  case 'customs_office': return 'fill-violet-600 ring-violet-100 bg-violet-50 text-violet-700';
                  case 'corridor': return 'fill-amber-500 ring-amber-100 bg-amber-50 text-amber-700';
                  case 'commodity': return 'fill-emerald-500 ring-emerald-100 bg-emerald-50 text-emerald-700';
                  case 'regulation': return 'fill-sky-500 ring-sky-100 bg-sky-50 text-sky-700';
                  case 'organization': return 'fill-rose-500 ring-rose-100 bg-rose-50 text-rose-700';
                  default: return 'fill-slate-500 ring-slate-100 bg-slate-50 text-slate-700';
                }
              };

              return (
                <g 
                  key={idx}
                  className="cursor-pointer group select-none"
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Outer Pulsing Glow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "26" : "20"}
                    className={`transition-all duration-300 ${
                      isSelected 
                        ? 'fill-indigo-500/10 stroke-indigo-500/20 stroke-2' 
                        : isHighlighted 
                          ? 'fill-slate-200/50 stroke-slate-300/40' 
                          : 'fill-transparent stroke-transparent'
                    }`}
                  />

                  {/* Node Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "18" : "15"}
                    className={`transition-all duration-300 ${getNodeStyles()} ${
                      isSelected ? 'stroke-indigo-600 stroke-[2]' : 'stroke-white stroke-[2]'
                    }`}
                  />

                  {/* Label Text */}
                  <text
                    x={pos.x}
                    y={pos.y + (isSelected ? 36 : 30)}
                    textAnchor="middle"
                    className={`text-[9px] font-bold font-sans transition-all duration-300 ${
                      isSelected ? 'fill-indigo-800 font-extrabold scale-105' : 'fill-slate-600 font-medium'
                    }`}
                  >
                    {isKurdish ? node.kuLabel : node.arLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details & Systemic Impact Tracing panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="space-y-1 bg-slate-50/70 p-4 rounded-[20px] border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg font-mono ${
                    selectedNode.status === 'bottleneck' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                    selectedNode.status === 'restricted' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-emerald-50 text-emerald-400 border border-emerald-100'
                  }`}>
                    {selectedNode.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-bold">
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                </div>
                
                <h4 className="text-sm font-black text-slate-900 pt-1.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  {isKurdish ? selectedNode.kuLabel : selectedNode.arLabel}
                </h4>
                
                <p className="text-xs text-slate-500 leading-relaxed font-medium pt-1">
                  {isKurdish ? selectedNode.kuDescription : selectedNode.arDescription}
                </p>
              </div>

              {/* Connected relations & impact tracing log */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isKurdish ? 'کاریگەریییە بەستراوەکانی ژێرکەوت (Connected Dependencies)' : 'تتبع الآثار المترابطة والاعتماديات جمركياً'}
                </h5>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {outgoing.map((link, i) => {
                    const targetNode = KNOWLEDGE_GRAPH_NODES.find(n => n.id === link.target);
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs bg-slate-50/30 border border-slate-100/40 p-2.5 rounded-xl">
                        <span className="font-bold text-slate-700">
                          {isKurdish ? selectedNode.kuLabel : selectedNode.arLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] text-gray-400 italic font-mono bg-slate-50 px-1.5 py-0.5 rounded-md">
                          {isKurdish ? link.kuLabel : link.arLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-indigo-600">
                          {targetNode ? (isKurdish ? targetNode.kuLabel : targetNode.arLabel) : ''}
                        </span>
                      </div>
                    );
                  })}

                  {incoming.map((link, i) => {
                    const sourceNode = KNOWLEDGE_GRAPH_NODES.find(n => n.id === link.source);
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs bg-slate-50/30 border border-slate-100/40 p-2.5 rounded-xl">
                        <span className="font-bold text-[#0066FF]">
                          {sourceNode ? (isKurdish ? sourceNode.kuLabel : sourceNode.arLabel) : ''}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] text-gray-400 italic font-mono bg-slate-50 px-1.5 py-0.5 rounded-md">
                          {isKurdish ? link.kuLabel : link.arLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-700">
                          {isKurdish ? selectedNode.kuLabel : selectedNode.arLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 py-12">
              {isKurdish ? 'بۆ بینینی پەیوەندی و خاڵە کاریگەرەکان، کلیک لەسەر خاڵێکی سەرەوە بکە.' : 'اضغط على أحد المكونات لتتبع أثره اللوجستي في المرصد.'}
            </div>
          )}

          {/* Sovereign Security Clearance Warning Disclaimer */}
          <div className="bg-slate-900 text-white rounded-[20px] p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0066FF] flex items-center gap-1.5 select-none font-mono">
              <Globe className="w-3.5 h-3.5 animate-pulse text-[#0066FF]" />
              <span>Sovereign Security Sandbox</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {isKurdish 
                ? 'گرێدانی مەنەفێست و دەروازەکان مۆدێلێکی هەستیارە کە تەنیا بە بەکاربەرانی ڕێپێدراوی وەزارەتە فیدراڵییەکان پیشان دەدرێت.' 
                : 'يخضع مخطط الترابط والمنافذ للتصنيف الأمني الخاص بالمؤسسات الرقابية لدرء المخاطر التنافسية.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
