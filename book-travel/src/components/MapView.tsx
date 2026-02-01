import React from 'react';
import { Book, BookJourney, Review } from '../types';

interface Props {
  books: Book[];
  journeys: BookJourney[];
  reviews: Review[];
  height?: string;
  singleBook?: boolean;
}

export default function MapView({ books, journeys, reviews, height = '400px', singleBook = false }: Props) {
  // Group journeys by book
  const bookJourneyMap = new Map<string, BookJourney[]>();
  journeys.forEach((j) => {
    const list = bookJourneyMap.get(j.book_id) || [];
    list.push(j);
    bookJourneyMap.set(j.book_id, list);
  });

  // Calculate map center from all journey points
  const allPoints = journeys.map((j) => ({ lat: j.latitude, lng: j.longitude }));
  const center = allPoints.length > 0
    ? {
        lat: allPoints.reduce((s, p) => s + p.lat, 0) / allPoints.length,
        lng: allPoints.reduce((s, p) => s + p.lng, 0) / allPoints.length,
      }
    : { lat: 36.5, lng: 127.5 };

  return (
    <div style={{ height }} className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Static map placeholder - in production, use Google Maps JavaScript API */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${singleBook ? 7 : 6}&size=600x400&maptype=roadmap${journeys
            .map(
              (j) =>
                `&markers=color:red%7C${j.latitude},${j.longitude}`
            )
            .join('')}&key=YOUR_API_KEY`}
          alt="Map"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Fallback SVG map visualization */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-green-50">
          <svg className="w-full h-full" viewBox="0 0 600 400">
            {/* Draw routes for each book */}
            {Array.from(bookJourneyMap.entries()).map(([bookId, bJourneys]) => {
              const book = books.find((b) => b.id === bookId);
              const color = book?.route_color || '#999';
              const sorted = [...bJourneys].sort((a, b) => a.order_index - b.order_index);
              // Normalize coordinates to SVG viewBox
              const points = sorted.map((j) => ({
                x: ((j.longitude - 126) / 4) * 500 + 50,
                y: ((38.5 - j.latitude) / 4) * 350 + 25,
                name: j.location_name,
              }));

              return (
                <g key={bookId}>
                  {/* Route lines */}
                  {points.map((p, i) =>
                    i > 0 ? (
                      <line
                        key={`line-${i}`}
                        x1={points[i - 1].x}
                        y1={points[i - 1].y}
                        x2={p.x}
                        y2={p.y}
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray="8,4"
                        opacity="0.8"
                      />
                    ) : null
                  )}
                  {/* Location markers */}
                  {points.map((p, i) => (
                    <g key={`marker-${i}`}>
                      <circle cx={p.x} cy={p.y} r="8" fill={color} stroke="white" strokeWidth="2" />
                      <text
                        x={p.x}
                        y={p.y - 14}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#333"
                        fontWeight="bold"
                      >
                        {p.name}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          {!singleBook && (
            <div className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 text-xs space-y-0.5">
              {books.map((b) => (
                <div key={b.id} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: b.route_color }}
                  />
                  <span className="text-gray-700">{b.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
