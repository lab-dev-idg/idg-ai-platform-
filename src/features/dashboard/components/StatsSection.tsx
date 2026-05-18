import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Anchor, Plane } from 'lucide-react';

export function StatsSection() {
  const gates = [
    {
      title: "دەروازەی ئیبراهیم خەلیل",
      icon: MapPin,
      color: "from-green-400 to-green-600",
      time: "٣٠ خولەک",
      status: "چالاک و خێرا",
      type: "green"
    },
    {
      title: "بەندەری ئوم قەسر",
      icon: Anchor,
      color: "from-yellow-400 to-yellow-600",
      time: "٤٥ خولەک",
      status: "چالاک و خێرا",
      type: "yellow"
    },
    {
      title: "فڕۆکەخانەی هەولێر",
      icon: Plane,
      color: "from-blue-400 to-blue-600",
      time: "١٥ خولەک",
      status: "چالاک و خێرا",
      type: "blue"
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4 md:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {gates.map((gate, i) => (
          <Card
            key={i}
            className={`relative overflow-hidden border rounded-3xl top-stat-card ${gate.type}`}
          >
            <div
              className={`absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gate.color}`}
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <gate.icon className="w-4 h-4" />
                {gate.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px]">حالەت</span>
                  <Badge className="mt-1">
                    {gate.status}
                  </Badge>
                </div>
                <div className="text-left">
                  <span className="text-[10px] block">
                    کاتی چاوەڕوانی
                  </span>
                  <span className="font-black text-lg">
                    {gate.time}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
