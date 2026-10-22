// Phosphor icons for server components (the /ssr build has no React context).
import {
  AirplaneTilt,
  Boat,
  Broadcast,
  Bus,
  CableCar,
  CalendarCheck,
  Mountains,
  Repeat,
  Train,
  TrainRegional,
  TrainSimple,
  Tram,
  TrendUp,
  Van,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { Mode, TimeKind } from "@/content/cities";

export const modeIcon: Record<Mode, Icon> = {
  metro: TrainSimple,
  monorail: TrainSimple,
  suburban: TrainRegional,
  highspeed: Train,
  lrt: Tram,
  tram: Tram,
  bus: Bus,
  brt: Bus,
  ferry: Boat,
  funicular: Mountains,
  cablecar: CableCar,
  airport: AirplaneTilt,
  servees: Van,
  microbus: Van,
};

export const timeIcon: Record<TimeKind, Icon> = {
  live: Broadcast,
  predicted: TrendUp,
  scheduled: CalendarCheck,
  estimated: Repeat,
};
