import { Anchor, Gauge, Navigation, Radio, Ship, Zap } from 'lucide-react';

export function getStatusConfig(status: string) {
  const s = status.toLowerCase();

  if (s === 'dp' || s === 'dynamic_position' || s === 'dynamic position') {
    return { icon: Gauge, key: 'dp', color: 'text-info' };
  }
  if (['stand by', 'stand_by', 'standby'].includes(s)) {
    return { icon: Radio, key: 'stand.by', color: 'text-orange-600' };
  }
  if (['stand by ready', 'stand_by_ready', 'standbyready'].includes(s)) {
    return { icon: Radio, key: 'stand.by.ready', color: 'text-cyan-500' };
  }
  if (['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine'].includes(s)) {
    return { icon: Navigation, key: 'in.travel', color: 'text-success' };
  }
  if (['fast transit', 'fasttransit', 'fast_transit'].includes(s)) {
    return { icon: Zap, key: 'fast.transit', color: 'text-green-700' };
  }
  if (s === 'slow') {
    return { icon: Navigation, key: 'slow', color: 'text-warning-400' };
  }
  if (['at anchor', 'at_anchor', 'stopped'].includes(s)) {
    return { icon: Anchor, key: 'at.anchor', color: 'text-warning-500' };
  }
  if (['moored', 'port'].includes(s)) {
    return { icon: Ship, key: 'moored', color: 'text-primary' };
  }
  if (s === 'dock') {
    return { icon: Ship, key: 'dock', color: 'text-gray-700' };
  }
  return { icon: Ship, key: 'other', color: 'text-muted-foreground' };
}
