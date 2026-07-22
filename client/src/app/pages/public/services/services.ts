import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  icon: string;
  bullets: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  services: ServiceItem[] = [
    {
      num: '01',
      title: 'Civil Construction',
      desc: 'High-quality residential, commercial, and administrative building complexes.',
      icon: 'construction',
      bullets: ['High-Rise Buildings', 'Administrative Blocks', 'Housing Projects', 'Institutional Buildings']
    },
    {
      num: '02',
      title: 'Highways & Expressways',
      desc: 'State-of-the-art road networks, lane expansions, and heavy-duty pavements.',
      icon: 'add_road',
      bullets: ['National Highways', 'State Expressways', 'Rigid & Flexible Pavements', 'Bypass Roads']
    },
    {
      num: '03',
      title: 'Bridges & Flyovers',
      desc: 'Engineering complex structures to cross rivers, valleys, and busy intersections.',
      icon: 'domain',
      bullets: ['Flyovers & Underpasses', 'River Bridges', 'Overbridges (ROBs)', 'Pre-stressed Concrete Bridges']
    },
    {
      num: '04',
      title: 'Metro Rail & Transit',
      desc: 'Mass transit infrastructure supporting modern urban mobility systems.',
      icon: 'train',
      bullets: ['Metro Stations', 'Elevated Viaducts', 'Depot Construction', 'Track Bed Civil Works']
    },
    {
      num: '05',
      title: 'Water Supply & Sewerage',
      desc: 'Urban and rural public utility pipelines, treatment plants, and distribution.',
      icon: 'water_drop',
      bullets: ['Water Treatment Plants (WTP)', 'Sewage Treatment Plants (STP)', 'Cross-Country Pipelines', 'Drainage Networks']
    },
    {
      num: '06',
      title: 'Smart City Infrastructure',
      desc: 'Modern utility integration, underground cabling, and sensory networks.',
      icon: 'location_city',
      bullets: ['Underground Power Ducting', 'Smart Street Lighting', 'Command & Control Centers', 'Public Utility Spaces']
    },
    {
      num: '07',
      title: 'Industrial Construction',
      desc: 'Heavy industrial structures, warehouses, factory sheds, and foundations.',
      icon: 'factory',
      bullets: ['Factory Sheds & Warehouses', 'Machine Foundations', 'Power Sub-stations', 'Refinery Civil Works']
    },
    {
      num: '08',
      title: 'Airport Infrastructure',
      desc: 'Aviation support pavements, terminals, and civil runway works.',
      icon: 'flight_takeoff',
      bullets: ['Runway Construction', 'Terminal Buildings', 'ATC Tower Structures', 'Hangars & Aprons']
    },
    {
      num: '09',
      title: 'Irrigation & Canals',
      desc: 'Agricultural water management channels, check dams, and gates.',
      icon: 'agriculture',
      bullets: ['Canal Lining & Excavation', 'Check Dams', 'Barrage Gates Civil Works', 'Micro-Irrigation Ducts']
    },
    {
      num: '10',
      title: 'Landscaping & Parks',
      desc: 'Green urban redevelopment, open spaces, and environmental parks.',
      icon: 'park',
      bullets: ['Urban Parks & Plazas', 'Riverfront Development', 'Highway Plantations', 'Environmental Refurbishment']
    },
    {
      num: '11',
      title: 'Renovation & Retrofitting',
      desc: 'Heritage restoration, building strengthening, and asset lifespan extension.',
      icon: 'build_circle',
      bullets: ['Heritage Building Restoration', 'Structural Seismic Retrofitting', 'Interior Fit-outs', 'Building Expansion']
    },
    {
      num: '12',
      title: 'Project Management (PMC)',
      desc: 'Consulting, site supervision, feasibility studies, and digital progress audits.',
      icon: 'assignment',
      bullets: ['Third-Party Quality Audits', 'Detailed Project Reports (DPR)', 'Construction Site Supervision', 'Quantity Surveying']
    }
  ];
}
