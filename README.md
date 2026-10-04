# EDDExampleSite

**Professional Hydroponic / Flex Farm Control Dashboard**  
Example application for presentation purposes.

## Overview

A minimalistic, modern control dashboard for a nutrient-delivery system serving five Flex Farms.  
Built with **React + Tailwind CSS**. Non-functional demo (mock live data).

### System Elements Visualized

| Component | Description |
|-----------|-------------|
| Building Water Line | Source water supply |
| Solenoid Water Valve | Controlled inlet |
| Filter | Water filtration |
| Needle Valve | Flow regulation |
| DMA15 Flow Meter | Flow measurement |
| CPS11E pH Sensor | pH monitoring |
| CLS21E EC Sensor | Electrical conductivity |
| CM442 Controller | Central process controller |
| Dosing Pumps | Nutrient A, Nutrient B, Acidic Solution |
| In-line Pump | Circulation |
| Tank + FMX11 | Mixing tank & level sensor |
| 5× Flex Farms | Growing units |
| Drain Pipe | System drain |

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
npm run preview
```

## Stack

- React 18
- Vite
- Tailwind CSS 3
- Lucide React (icons)

## Notes

- All sensor values and device states are simulated for presentation.
- Designed to demonstrate layout, information hierarchy, and system topology.
- Ready to be extended with real CM442 / Endress+Hauser device APIs.
