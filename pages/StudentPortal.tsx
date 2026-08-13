import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SecureVideoPlayer } from '../components/SecureVideoPlayer';
import { registerStudent, verifyStudentLogin } from '../lib/students';
import { sendStudentWelcomeEmail } from '../lib/email';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  PlayCircle, ShieldCheck, Clock, BookOpen, UserCheck, 
  Sparkles, LogOut, Video, ArrowLeft, ChevronRight, CheckCircle2,
  Lock, AlertTriangle, Loader2, User
} from 'lucide-react';



interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
}

interface CourseModule {
  id: string;
  name: string;
  lessons: Lesson[];
}

interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge: string;
  totalLessons: number;
  modules: CourseModule[];
}

// 1. ALL 22 SKETCHUP + V-RAY VIDEOS
const SKETCHUP_VRAY_LESSONS: Lesson[] = [
  {
    id: 'sk-1',
    title: '01. SketchUp Workspace & 3D Modeling Fundamentals',
    duration: '18 min',
    videoUrl: 'https://drive.google.com/file/d/1QBgN98YL4hdIgB7J9wyc8OpNOYeYMvxO/preview',
    description: 'Complete guide to setting up your SketchUp 3D workspace, camera controls, and shortcut keys.'
  },
  {
    id: 'sk-2',
    title: '02. V-Ray Exterior Sunlight & HDRI Setup',
    duration: '24 min',
    videoUrl: 'https://drive.google.com/file/d/1EmKelOgblDsBTdm7_PrXytEOMTdwItcm/preview',
    description: 'Master photorealistic exterior sunlighting, dome lights, and HDRI sky maps.'
  },
  {
    id: 'sk-3',
    title: '03. V-Ray Materials & Realistic Surface Textures',
    duration: '31 min',
    videoUrl: 'https://drive.google.com/file/d/1v3RSZOwwMk3bdLEVnsRASNuW6-fWTq_w/preview',
    description: 'Creating realistic glass, polished concrete, wood grains, and metallic surfaces.'
  },
  {
    id: 'sk-4',
    title: '04. Interior Lighting & Camera Exposure Control',
    duration: '22 min',
    videoUrl: 'https://drive.google.com/file/d/156QUihh-1d1f0wZ6boXclQlDPFAtUAhY/preview',
    description: 'Set up artificial interior lights, IES profiles, and camera exposure.'
  },
  {
    id: 'sk-5',
    title: '05. High-Resolution Rendering & AI Denoising',
    duration: '29 min',
    videoUrl: 'https://drive.google.com/file/d/10AgJvh6Ezoi3XdgYlF6VhV7mNQ7KyE-I/preview',
    description: 'Render settings for crisp 4K outputs, GPU acceleration, and AI denoising.'
  },
  {
    id: 'sk-6',
    title: '06. Complex Material Layering & Reflection Maps',
    duration: '26 min',
    videoUrl: 'https://drive.google.com/file/d/10tFTa6jtLOJrBRGdsJlVE234GJsVMV6p/preview',
    description: 'Advanced reflection, bump maps, roughness, and subsurface scattering.'
  },
  {
    id: 'sk-7',
    title: '07. Complex Architectural Geometry Modeling',
    duration: '32 min',
    videoUrl: 'https://drive.google.com/file/d/1Hgl_oHb-ZMDWS2bevBrqbxV3qMZLiHcb/preview',
    description: 'Building curved facades, organic structures, and detailed architectural joinery.'
  },
  {
    id: 'sk-8',
    title: '08. Master Series 6.1 — Lighting & Scene Setup',
    duration: '25 min',
    videoUrl: 'https://drive.google.com/file/d/1Ov1R2dYA9XAs0FRMLJYk7qY5jRXMxTpg/preview',
    description: 'Setting up master scene environment, camera composition, and sun angles.'
  },
  {
    id: 'sk-9',
    title: '09. Master Series 6.2 — Environment & Landscape',
    duration: '27 min',
    videoUrl: 'https://drive.google.com/file/d/1dFKiQ9Pq2HfrwFwxyDw4YTVy7GNLMZl8/preview',
    description: 'Adding 3D trees, grass assets, terrain modeling, and outdoor hardscaping.'
  },
  {
    id: 'sk-10',
    title: '10. Master Series 6.3 — Material & Shading Workflows',
    duration: '30 min',
    videoUrl: 'https://drive.google.com/file/d/19RsFIFgrJCKbd28wDLLeVghvDoPojiHi/preview',
    description: 'PBR shading workflows, PBR textures, and realistic displacement maps.'
  },
  {
    id: 'sk-11',
    title: '11. Master Series 6.4 — Camera Angles & Framing',
    duration: '21 min',
    videoUrl: 'https://drive.google.com/file/d/1O7oR1PEaafFI8vSKHM12H0S8pwPJGT8H/preview',
    description: 'Architectural photography principles, two-point perspective, and rule of thirds.'
  },
  {
    id: 'sk-12',
    title: '12. Master Series 6.5 — Atmospheric & Fog Effects',
    duration: '28 min',
    videoUrl: 'https://drive.google.com/file/d/1vmH4winaH1qkjX_fRqzZnTYUdY5RKxOc/preview',
    description: 'Volumetric fog, god rays, atmospheric haze, and realistic cloud layers.'
  },
  {
    id: 'sk-13',
    title: '13. Master Series 6.6 — D5 Realtime Render Pipeline',
    duration: '34 min',
    videoUrl: 'https://drive.google.com/file/d/1uMJ4PnOu61_-_74KHWzLAHacYtxZlFeG/preview',
    description: 'Real-time raytracing setup, asset scattering, and 4K animation output.'
  },
  {
    id: 'sk-14',
    title: '14. Master Series 6.7 — Cinematic Walkthrough Paths',
    duration: '23 min',
    videoUrl: 'https://drive.google.com/file/d/1VQ9YvGCJ9TtfAgy-YrMiMPnmSMQ27O0L/preview',
    description: 'Smooth camera animation paths, transition cuts, and 60FPS video rendering.'
  },
  {
    id: 'sk-15',
    title: '15. Post-Production — Sky & Human Figures',
    duration: '25 min',
    videoUrl: 'https://drive.google.com/file/d/17WzsGZzwN5419Fo1gDWyowx56Dv5uoOL/preview',
    description: 'Adding realistic skies, scale figures, vegetation, and lighting passes in Photoshop.'
  },
  {
    id: 'sk-16',
    title: '16. Portfolio Presentation & Camera Raw Grading',
    duration: '28 min',
    videoUrl: 'https://drive.google.com/file/d/1XXcEbzH3pedqDpkGkXhgPfqQkqDKrUJ2/preview',
    description: 'Color grading, Camera Raw filters, contrast tuning, and architectural portfolio layout.'
  },
  {
    id: 'sk-17',
    title: '17. Series 8.1 — Exterior Architectural Design',
    duration: '31 min',
    videoUrl: 'https://drive.google.com/file/d/1-koPhy3_o9wffoEsTmgyVo89VLvNJbfl/preview',
    description: 'Modern luxury residential facade modeling, glass curtain walls, and exterior details.'
  },
  {
    id: 'sk-18',
    title: '18. Series 8.2 — Interior Lighting Masterclass',
    duration: '29 min',
    videoUrl: 'https://drive.google.com/file/d/1qXgyjH12P30uvXUvhQ7PXNO1jW2ZhpRD/preview',
    description: 'Cozy mood lighting, cove LED strips, spotlighting art, and realistic interior ambiance.'
  },
  {
    id: 'sk-19',
    title: '19. Series 8.3 — Parametric Geometry & Curved Surfaces',
    duration: '27 min',
    videoUrl: 'https://drive.google.com/file/d/1zh8Ms7tiaHW4ww3Xo8AySxDwpA1lTbIa/preview',
    description: 'Modeling complex parametric ceilings, acoustic wall panels, and custom furniture.'
  },
  {
    id: 'sk-20',
    title: '20. Series 8.4 — Advanced Vegetation & Site Landscape',
    duration: '33 min',
    videoUrl: 'https://drive.google.com/file/d/1WD98jJznJhTY-eXIom14dERFzX6Ju2eD/preview',
    description: 'High-poly 3D plant scatter, garden landscaping, water features, and pool reflection.'
  },
  {
    id: 'sk-21',
    title: '21. Series 8.5 — Dusk & Night Lighting Scene',
    duration: '26 min',
    videoUrl: 'https://drive.google.com/file/d/1W_IgwFKYKl9i3tYCACkc7qsmVqpEgEkk/preview',
    description: 'Dusk sky lighting setup, artificial interior glow, and exterior garden landscape lights.'
  },
  {
    id: 'sk-22',
    title: '22. Series 8.6 — Commercial Render Polish & Final Output',
    duration: '36 min',
    videoUrl: 'https://drive.google.com/file/d/1bgajytPRjkAzbWPRrDanOn28lasZGmWu/preview',
    description: 'Final 8K commercial rendering, EXR element passes, glare/bloom effects, and client delivery.'
  }
];

// 2. D5 RENDER DRIVE FOLDER VIDEOS (FOLDER: 1-tXyeGkIbw0RQXgfqnE8meZGwQcrW8Qu)
const D5_RENDER_LESSONS: Lesson[] = [
  {
    id: 'd5-1',
    title: '1. Introduction',
    duration: '15 min',
    videoUrl: 'https://drive.google.com/file/d/11P5eqY7eVbH0y3GqTFhrz6lhGwBrsM_y/preview',
    description: 'Introduction to D5 Render real-time raytracing interface and workspace setup.'
  },
  {
    id: 'd5-2',
    title: '2. Sending the model to D5',
    duration: '18 min',
    videoUrl: 'https://drive.google.com/file/d/1iNL-8v4RDokp3sQSBcZzQk2_39NitBal/preview',
    description: 'Live sync plugin workflow from SketchUp / Revit to D5 Render.'
  },
  {
    id: 'd5-3',
    title: '3. Materials',
    duration: '24 min',
    videoUrl: 'https://drive.google.com/embeddedfolderview?id=1_lhkxjv6OBfF3h_bf8-jHgATYaWGiKJQ#list',
    description: 'Applying real-time PBR glass, wood, stone, and metallic materials.'
  },
  {
    id: 'd5-4',
    title: '4. Decoration',
    duration: '22 min',
    videoUrl: 'https://drive.google.com/embeddedfolderview?id=1ovrQMcER4Adfms_CzUQ6XBsFixTRCubx#list',
    description: 'Placing interior furniture, decor assets, and high-poly 3D models.'
  },
  {
    id: 'd5-5',
    title: '5. Exterior Elements',
    duration: '27 min',
    videoUrl: 'https://drive.google.com/embeddedfolderview?id=1FY0ilMU_cuRwBjMMCKWFGWR5RL-iMfzJ#list',
    description: 'Scattering foliage, trees, grass, cars, and outdoor landscape assets.'
  },
  {
    id: 'd5-6',
    title: '6. Lighting and Effects Tabs',
    duration: '26 min',
    videoUrl: 'https://drive.google.com/embeddedfolderview?id=1Ehn3AnK30omQn2Cw7vHOm07OPZr9t4IT#list',
    description: 'Sunlight setup, HDRI skies, artificial lights, volumetric fog, and god rays.'
  },
  {
    id: 'd5-7',
    title: '7. Post Production in Photoshop',
    duration: '20 min',
    videoUrl: 'https://drive.google.com/embeddedfolderview?id=1tbWhkkb8g211dgPYULM2tiBOnw-GrghZ#list',
    description: 'Final render output post-processing, color grading, and Camera Raw tuning.'
  }
];

// 3. AUTOCAD DRIVE FOLDER VIDEOS (FOLDER: 1g29PtUlmMnw7NjzE50CDcrFbAEY7ClwP)
const AUTOCAD_LESSONS: Lesson[] = [
  {
    id: 'cad-1',
    title: 'Video 1',
    duration: '20 min',
    videoUrl: 'https://drive.google.com/file/d/1926INyz5lTHaBXItlrEg5FImuBtavlBC/preview',
    description: 'AutoCAD interface overview, draw tools, line commands, and unit setup.'
  },
  {
    id: 'cad-2',
    title: 'video 2',
    duration: '22 min',
    videoUrl: 'https://drive.google.com/file/d/1ncR5mTDR-cpbNvHWXTJVXBpdLz1VuiLj/preview',
    description: 'Drawing 2D wall layouts, doors, windows, and architectural offsets.'
  },
  {
    id: 'cad-3',
    title: 'video 3',
    duration: '25 min',
    videoUrl: 'https://drive.google.com/file/d/1TgepXzpip2GBWGJPztV2nuAp6gKuj8_c/preview',
    description: 'Modifying tools: Trim, Extend, Fillet, Chamfer, and Array commands.'
  },
  {
    id: 'cad-4',
    title: 'video 4',
    duration: '21 min',
    videoUrl: 'https://drive.google.com/file/d/1THyaz0uQinZzv0MOvqueO7DDBZgCBCuI/preview',
    description: 'Working with CAD blocks, inserting furniture, and creating symbol libraries.'
  },
  {
    id: 'cad-5',
    title: 'video 5',
    duration: '24 min',
    videoUrl: 'https://drive.google.com/file/d/1BEK7HK5GgaNnnCQIqZ4SPdf7ESKb9qru/preview',
    description: 'Layer management, line types, colors, and line weight assignments.'
  },
  {
    id: 'cad-6',
    title: 'Video 6',
    duration: '19 min',
    videoUrl: 'https://drive.google.com/file/d/1pvi5aLfMkLzXQERsHjC9SPFHuKkx1nuH/preview',
    description: 'Architectural text annotations, leader lines, and multi-text formatting.'
  },
  {
    id: 'cad-7',
    title: 'video 7',
    duration: '26 min',
    videoUrl: 'https://drive.google.com/file/d/1LparpNNvg5VYlE3AzRV40RwtpIAwaYTH/preview',
    description: 'Dimensioning styles, linear/aligned dimensions, and technical callouts.'
  },
  {
    id: 'cad-8',
    title: 'video 8',
    duration: '28 min',
    videoUrl: 'https://drive.google.com/file/d/1-lAok5W-LnN3K3YhEPR0gCGMDDSEaOep/preview',
    description: 'Hatch patterns, wall hatching, flooring tiles, and section fills.'
  },
  {
    id: 'cad-9',
    title: 'video 9',
    duration: '30 min',
    videoUrl: 'https://drive.google.com/file/d/1s4bnMrEg8gC9hqFC6R9iBjXZfvA73Fb-/preview',
    description: 'Page setup, layout viewports, scaling to construction size, and PDF plotting.'
  }
];

// 4. LUMION DRIVE FOLDER VIDEOS (FOLDER: 1MQUbXwGJ7Qa3lEIWWLfbtrPbDOIIgt3C)
const LUMION_LESSONS: Lesson[] = [
  {
    id: 'lum-1',
    title: '1. Software requirements and introduction',
    duration: '16 min',
    videoUrl: 'https://drive.google.com/file/d/1y-li4Wf4S2XEwU8M9-v3nLPNOy7QU_rY/preview',
    description: 'Hardware requirements, Lumion installation, interface overview, and basic setup.'
  },
  {
    id: 'lum-2',
    title: '2. User Interface',
    duration: '18 min',
    videoUrl: 'https://drive.google.com/file/d/1_B59lcojYjovINkiSQMVQaaacZ5Qoq2d/preview',
    description: 'Navigating Lumion workspace, build mode, camera controls, and menu panels.'
  },
  {
    id: 'lum-3',
    title: '3. Navigation',
    duration: '15 min',
    videoUrl: 'https://drive.google.com/file/d/1-o3jHK2BVph5tt5saBDWOfT7vR9mHsM1/preview',
    description: 'Smooth camera navigation, speed controls, keyboard shortcuts, and view presets.'
  },
  {
    id: 'lum-4',
    title: '4. Weather and Landscape',
    duration: '22 min',
    videoUrl: 'https://drive.google.com/file/d/1kZCtGOG6ZJmFB5sCFsr4V9ruKH78uSTY/preview',
    description: 'Sun height, sun direction, cloud types, rain, snow, and terrain sculpting.'
  },
  {
    id: 'lum-5',
    title: '5. Creating a scene with landscape and adding effects',
    duration: '25 min',
    videoUrl: 'https://drive.google.com/file/d/1Vd5RbecNsLOffgIwaaeokLySOyMDJObo/preview',
    description: 'Building site context, adding grass, ocean water, mountains, and visual styles.'
  },
  {
    id: 'lum-6',
    title: '6. Basic Tools',
    duration: '20 min',
    videoUrl: 'https://drive.google.com/file/d/11VYyd4vSILbrcbz0_rxp_AwQ1OnufpXQ/preview',
    description: 'Placement tools, move, rotate, scale, mass placement, and cluster scattering.'
  },
  {
    id: 'lum-7',
    title: '7. Creating a landscape scene',
    duration: '27 min',
    videoUrl: 'https://drive.google.com/file/d/1UnXn4H7DIlL7S93zC-wsM3AIoDMzVSYa/preview',
    description: 'Adding 3D trees, plants, rocks, outdoor lighting, and ambient environment.'
  },
  {
    id: 'lum-8',
    title: '8. Advanced Options',
    duration: '24 min',
    videoUrl: 'https://drive.google.com/file/d/1sdNsIopW5YFbI6JluN0qgRrKcagcnAs7/preview',
    description: 'Advanced render effects, Real Skies, Hyperlight, volumetric lights, and reflection planes.'
  },
  {
    id: 'lum-9',
    title: '9. Import a Model and Materials',
    duration: '29 min',
    videoUrl: 'https://drive.google.com/file/d/1y6zqbd7A8_0EGTNrRVTnWwaRV2_pwJWP/preview',
    description: 'Importing 3D models from SketchUp/Revit, Lumion PBR material assignment, and weathering.'
  },
  {
    id: 'lum-10',
    title: '10. Enhancing the scene',
    duration: '26 min',
    videoUrl: 'https://drive.google.com/file/d/10Cb02Eo5GNJ-qqFv-2oAySSpGO50ID7x/preview',
    description: 'Adding animated 3D people, vehicles, outdoor furniture, and fine detail objects.'
  },
  {
    id: 'lum-11',
    title: '11. Lights',
    duration: '23 min',
    videoUrl: 'https://drive.google.com/file/d/1EfP6Mh9wD3uo8HrNjNy3qWeW2vTO9Pcs/preview',
    description: 'Spotlights, omni lights, area lights, LED strips, and night scene lighting.'
  },
  {
    id: 'lum-12',
    title: '12. Rendering an Interior space',
    duration: '31 min',
    videoUrl: 'https://drive.google.com/file/d/1XIuT7FUBRRBkTmmE2u-b3i4nQReEymwY/preview',
    description: 'Setting up interior camera shots, depth of field, artificial illumination, and rendering.'
  },
  {
    id: 'lum-13',
    title: '13. Animation',
    duration: '33 min',
    videoUrl: 'https://drive.google.com/file/d/1QgLnvygNxpamAD_HhNw32wDeVGHuRQyz/preview',
    description: 'Creating camera keyframes, movie clips, clip transitions, and rendering walkthrough MP4s.'
  },
  {
    id: 'lum-14',
    title: '14. 360 Panaroma',
    duration: '21 min',
    videoUrl: 'https://drive.google.com/file/d/102kAzSbXfQz_ABxXfzIPuEqNOf6iiXzn/preview',
    description: 'Rendering interactive 360-degree panoramas for VR headsets and client presentations.'
  },
  {
    id: 'lum-15',
    title: '15. Animation Move',
    duration: '28 min',
    videoUrl: 'https://drive.google.com/file/d/129bsGLTHPWaEZxm2cMnmJIitC0u_1_E8/preview',
    description: 'Animating moving cars, walking people, opening doors, and flying birds.'
  }
];

const REVIT_LESSONS: Lesson[] = [
  {
    "id": "rev-1",
    "title": "1. Introduction",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/15xUxRJxsMwC-bGz3Klq7eeU60P3CFdhm/preview",
    "description": "Video tutorial covering 1. Introduction"
  },
  {
    "id": "rev-2",
    "title": "2. Creating Walls and Drawing Walls",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1UtNjNaxIJZRFRrAO3W95ze7ZFrAiyaaw/preview",
    "description": "Video tutorial covering 2. Creating Walls and Drawing Walls"
  },
  {
    "id": "rev-3",
    "title": "3. Floors, Placing Doors, Windows and Elevation",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1YbVsqSWH37oNSAfdmhM8yud4gqw9UZol/preview",
    "description": "Video tutorial covering 3. Floors, Placing Doors, Windows and Elevation"
  },
  {
    "id": "rev-4",
    "title": "4. Edit Profile and Edit Boundary",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1ylQm9017s8cHeDcvI3peh383buDlpwd9/preview",
    "description": "Video tutorial covering 4. Edit Profile and Edit Boundary"
  },
  {
    "id": "rev-5",
    "title": "5. Creating Levels and Making a Multi Story Building",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1_VhSY3qXVjgmm_hFL0Dyc7pvoN0eLLw9/preview",
    "description": "Video tutorial covering 5. Creating Levels and Making a Multi Story Building"
  },
  {
    "id": "rev-6",
    "title": "6. Adding Skirting to walls - Sweep and Reveals",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1aUqjt1s7XDGJuqxNW3lTSWkp_bM5kE-v/preview",
    "description": "Video tutorial covering 6. Adding Skirting to walls - Sweep and Reveals"
  },
  {
    "id": "rev-7",
    "title": "7. Wall Sweep and Reveals 2",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1QQ5656Dqhoj3HQocHz6tHeUd3zNQqJEB/preview",
    "description": "Video tutorial covering 7. Wall Sweep and Reveals 2"
  },
  {
    "id": "rev-8",
    "title": "8. Simple Roof and Gable Roof",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1nFaoh4wg57JF23OqD6_2z7HEEzK96hgd/preview",
    "description": "Video tutorial covering 8. Simple Roof and Gable Roof"
  },
  {
    "id": "rev-9",
    "title": "9. Curtain Wall",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1F-MtIulRK1YR7P9oFEh1msEqa55fcpKh/preview",
    "description": "Video tutorial covering 9. Curtain Wall"
  },
  {
    "id": "rev-10",
    "title": "10. How to Make Louvers",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/19xVh2NqfukHVERGScQ028nixtcN-d5Mw/preview",
    "description": "Video tutorial covering 10. How to Make Louvers"
  },
  {
    "id": "rev-11",
    "title": "11. Components, Ceiling and Materials",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/10Tg6zbIo2ip4_8Zl_UjoLOgYLSS4dj5T/preview",
    "description": "Video tutorial covering 11. Components, Ceiling and Materials"
  },
  {
    "id": "rev-12",
    "title": "12. Family Creation - Extrude, Blend, Revolve, Sweep and Void",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1XWI70hZ97DMhnKz_d7frWKuwEsGAi_XD/preview",
    "description": "Video tutorial covering 12. Family Creation - Extrude, Blend, Revolve, Sweep and Void"
  },
  {
    "id": "rev-13",
    "title": "13. How to Make Table with Parameters",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1PFFIpeaYPSCjVKH3uZKeoSK_5m_Z-pjG/preview",
    "description": "Video tutorial covering 13. How to Make Table with Parameters"
  },
  {
    "id": "rev-14",
    "title": "14. Work Planes - How to make a Wall Cupboard",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1WG6GzwSzR7Xu88_zGdrTtgwb_-kV1-Qk/preview",
    "description": "Video tutorial covering 14. Work Planes - How to make a Wall Cupboard"
  },
  {
    "id": "rev-15",
    "title": "15. How to Make Sink",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1WQK9bvza_CXkmna645Qt10p2hbyUiJN1/preview",
    "description": "Video tutorial covering 15. How to Make Sink"
  },
  {
    "id": "rev-16",
    "title": "16. Designed Table",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1bmHgjp3andp6BITR_khAwLRwLrzz1T0K/preview",
    "description": "Video tutorial covering 16. Designed Table"
  },
  {
    "id": "rev-17",
    "title": "17. Stairs",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/119OLorvLngLXTqSwCwX43aMo2wfcijiR/preview",
    "description": "Video tutorial covering 17. Stairs"
  },
  {
    "id": "rev-18",
    "title": "18. Spiral Stairs",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1VnKESHhClayzZQz6r2UMGsvVKTdAYr-s/preview",
    "description": "Video tutorial covering 18. Spiral Stairs"
  },
  {
    "id": "rev-19",
    "title": "19. Stairs by Sketch",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1la_wEmmp9rLFosdRZss9lWA2tob8DQAG/preview",
    "description": "Video tutorial covering 19. Stairs by Sketch"
  },
  {
    "id": "rev-20",
    "title": "20. RAMP",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1ITYm6tAwKa18pn0Xi0KUqe8txxN5WWnh/preview",
    "description": "Video tutorial covering 20. RAMP"
  },
  {
    "id": "rev-21",
    "title": "21. Wall, Floor Structure and Materials",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1XbgCf85UPd7BP0MyN7yFElJFQPW-6Hde/preview",
    "description": "Video tutorial covering 21. Wall, Floor Structure and Materials"
  },
  {
    "id": "rev-22",
    "title": "22. Roof - Fascia, Gutter and Soffit",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/13vjdFt6FBKYYY6kgloipX7NCGIBCtlhZ/preview",
    "description": "Video tutorial covering 22. Roof - Fascia, Gutter and Soffit"
  },
  {
    "id": "rev-23",
    "title": "23. Classic Windows Frame Family Creation",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1McQlS_XA16ufW8G-IPPZ2wPgn-0NBXiN/preview",
    "description": "Video tutorial covering 23. Classic Windows Frame Family Creation"
  },
  {
    "id": "rev-24",
    "title": "24. Windows Family Creation Place Windows in the Corner of a Wall",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1sS11i6463CQqWxXPQ6DLB2014pH4ZNv6/preview",
    "description": "Video tutorial covering 24. Windows Family Creation Place Windows in the Corner of a Wall"
  },
  {
    "id": "rev-25",
    "title": "25. How to make a door family Open and close in different angles",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1MJ14L09RM46A73IFzxHbXBtUfucqY5cb/preview",
    "description": "Video tutorial covering 25. How to make a door family Open and close in different angles"
  },
  {
    "id": "rev-26",
    "title": "26. Topo Surface - 1",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/12f680IpMPxDwBSOQbfglYmjaZipTwvaR/preview",
    "description": "Video tutorial covering 26. Topo Surface - 1"
  },
  {
    "id": "rev-27",
    "title": "27. Topo Surface - 2",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1cz1AXr6X0uCwt5d2SThCwanBTnK-CrXZ/preview",
    "description": "Video tutorial covering 27. Topo Surface - 2"
  },
  {
    "id": "rev-28",
    "title": "28. Masses",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1wo_pjjefcRJzNdfMRuBzQcPi0YIPTYLk/preview",
    "description": "Video tutorial covering 28. Masses"
  },
  {
    "id": "rev-29",
    "title": "29. Conceptual Mass",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/18uhpOOPjhjQSDqYn82tGwqdxjmZuC6ku/preview",
    "description": "Video tutorial covering 29. Conceptual Mass"
  }
];

const ENSCAPE_LESSONS: Lesson[] = [
  {
    "id": "ens-1",
    "title": "1 - Introduction Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1xWF_nY58tcn2nQ7WCv6Jsrvl-Y3PgegK/preview",
    "description": "Video tutorial covering 1 - Introduction Shared folder"
  },
  {
    "id": "ens-2",
    "title": "2 - Sketchup Basics for Absolute Beginners Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1ZsaUK23VKTxo6G4dDfkLZPfKceCiRMcP/preview",
    "description": "Video tutorial covering 2 - Sketchup Basics for Absolute Beginners Shared folder"
  },
  {
    "id": "ens-3",
    "title": "3 - Building the Model with Sketchup Flextools Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1PDopvnlDWPhy9n5Oh94Qnm3wuU5gvGJ1/preview",
    "description": "Video tutorial covering 3 - Building the Model with Sketchup Flextools Shared folder"
  },
  {
    "id": "ens-4",
    "title": "4 - Visualizing our Residence with Enscape Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/171v6V_PStFgxkO_zWGr2wySG3O8802rh/preview",
    "description": "Video tutorial covering 4 - Visualizing our Residence with Enscape Shared folder"
  }
];

const TDSMAX_VRAY_LESSONS: Lesson[] = [
  {
    "id": "max-1",
    "title": "1 - Course Introduction Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1wEMg9ttFeX3J0Ul2hYB06rVSrq0ykH8f/preview",
    "description": "Video tutorial covering 1 - Course Introduction Shared folder"
  },
  {
    "id": "max-2",
    "title": "2 - Advanced Modeling For Architecture in 3ds Max Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1rWYclSxbI_CmUqhTbJIVRYF5sQ2J6LFL/preview",
    "description": "Video tutorial covering 2 - Advanced Modeling For Architecture in 3ds Max Shared folder"
  },
  {
    "id": "max-3",
    "title": "3 - Intro to Marvelous Designer for Creating Organic 3d Models Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1beVPlLaZiDQkJqn3GsnsB7N1Oc5k0gQj/preview",
    "description": "Video tutorial covering 3 - Intro to Marvelous Designer for Creating Organic 3d Models Shared folder"
  },
  {
    "id": "max-4",
    "title": "4 - Modeling Wrap Up Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/16kb_lPYhAgXPadsz5hJ4RHVLiZepJVIl/preview",
    "description": "Video tutorial covering 4 - Modeling Wrap Up Shared folder"
  },
  {
    "id": "max-5",
    "title": "5 - Cameras and Composition Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1T81WvSwpLFVHne3GlMf0WOYxK4_7Hyiq/preview",
    "description": "Video tutorial covering 5 - Cameras and Composition Shared folder"
  },
  {
    "id": "max-6",
    "title": "6 - Advanced Lighting Using Vray Lights Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1ZgNM3A6pf-L6QwWGrCzAQki1HxNfC5bb/preview",
    "description": "Video tutorial covering 6 - Advanced Lighting Using Vray Lights Shared folder"
  },
  {
    "id": "max-7",
    "title": "7 - Advanced Materials Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/12-t9VU7PUljnxvCuwCmaFdfqR4YDVF_K/preview",
    "description": "Video tutorial covering 7 - Advanced Materials Shared folder"
  },
  {
    "id": "max-8",
    "title": "8 - Advanced Rendering Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1-K5OG-Uy7e29ddrIshNHx1NHggwpYdGb/preview",
    "description": "Video tutorial covering 8 - Advanced Rendering Shared folder"
  },
  {
    "id": "max-9",
    "title": "9 - Atmospherics Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/19_gCUFCWG94GXpqCI_7Bvg5qAVy0u59A/preview",
    "description": "Video tutorial covering 9 - Atmospherics Shared folder"
  },
  {
    "id": "max-10",
    "title": "10 - Advanced PostProcessing Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1upFHbeBV4AzKVprSp2x8cunTNUx-QL5-/preview",
    "description": "Video tutorial covering 10 - Advanced PostProcessing Shared folder"
  },
  {
    "id": "max-11",
    "title": "11 - VRay Updates for VRay 5 and Above Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/17Um4-V8nXoBK22YteU21VOaxlO0s1bzY/preview",
    "description": "Video tutorial covering 11 - VRay Updates for VRay 5 and Above Shared folder"
  },
  {
    "id": "max-12",
    "title": "12 - Interior Project II With Latest VRay Features Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1Ki6Q8eVSZXzVXA7Iesy2EWQG1J8sEoya/preview",
    "description": "Video tutorial covering 12 - Interior Project II With Latest VRay Features Shared folder"
  },
  {
    "id": "max-13",
    "title": "13 - ADDITIONAL PROJECTS Shared folder",
    "duration": "20-30 min",
    "videoUrl": "https://drive.google.com/file/d/1w77XGK2gvMTNm7VQOpV3avg2DMqrDNND/preview",
    "description": "Video tutorial covering 13 - ADDITIONAL PROJECTS Shared folder"
  }
];

const COURSES_PORTAL_DATA: CourseItem[] = [
  // 1ST COURSE: Sketchup + V-Ray Masterclass (All 22 Videos)
  {
    id: 'sketchup-vray-masterclass',
    title: '1. SketchUp + V-Ray Complete Masterclass',
    subtitle: 'Full 3D Architectural Modeling & Photorealistic Rendering',
    description: 'Complete masterclass covering SketchUp 3D modeling, V-Ray exterior/interior sunlighting, realistic textures, PBR shading, and commercial render polish.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo&sz=w1000',
    badge: '5 Modules • 22 Videos',
    totalLessons: 22,
    modules: [
      {
        id: 'sk-mod-1',
        name: 'Module 1: SketchUp & V-Ray Essentials (3 Videos)',
        lessons: SKETCHUP_VRAY_LESSONS.slice(0, 3)
      },
      {
        id: 'sk-mod-2',
        name: 'Module 2: Advanced Rendering & Lighting Pass (4 Videos)',
        lessons: SKETCHUP_VRAY_LESSONS.slice(3, 7)
      },
      {
        id: 'sk-mod-3',
        name: 'Module 3: Master Visualization Series 6 (7 Videos)',
        lessons: SKETCHUP_VRAY_LESSONS.slice(7, 14)
      },
      {
        id: 'sk-mod-4',
        name: 'Module 4: Post-Production & Color Tuning (2 Videos)',
        lessons: SKETCHUP_VRAY_LESSONS.slice(14, 16)
      },
      {
        id: 'sk-mod-5',
        name: 'Module 5: Advanced Masterclass Series 8 (6 Videos)',
        lessons: SKETCHUP_VRAY_LESSONS.slice(16, 22)
      }
    ]
  },

  // 2ND COURSE: D5 Render Real-Time Visualization
  {
    id: 'd5-render-masterclass',
    title: '2. D5 Render Real-Time Visualization',
    subtitle: 'Real-Time Raytracing, Foliage Scatter & Cinematic Animations',
    description: 'Learn real-time raytracing in D5 Render, high-poly foliage scattering, atmospheric fog, god rays, and smooth 60FPS walkthrough camera animations.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr&sz=w1000',
    badge: '1 Module • 7 Videos',
    totalLessons: 7,
    modules: [
      {
        id: 'd5-mod-1',
        name: 'D5 Render Complete Course (7 Videos)',
        lessons: D5_RENDER_LESSONS
      }
    ]
  },

  // 3RD COURSE: AutoCAD 2D Drafting
  {
    id: 'autocad-2d-drafting',
    title: '3. AutoCAD 2D Drafting & Architectural Blueprints',
    subtitle: '2D Floor Plans, Blueprints & Construction Documentation',
    description: 'Master precision 2D drafting in AutoCAD, floor plans, furniture layouts, dimensioning standards, scaling, and printing construction blueprints.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR&sz=w1000',
    badge: '1 Module • 9 Videos',
    totalLessons: 9,
    modules: [
      {
        id: 'cad-mod-1',
        name: 'AutoCAD Complete Course (9 Videos)',
        lessons: AUTOCAD_LESSONS
      }
    ]
  },

  // 4TH COURSE: Lumion Landscape Architecture
  {
    id: 'lumion-landscape-walkthroughs',
    title: '4. Lumion Landscape Architecture & Walkthroughs',
    subtitle: '3D Exterior Landscape, Vegetation & Walkthrough Movies',
    description: 'Build immersive 3D exterior environments in Lumion, terrain sculpting, outdoor plant scattering, water reflections, and cinematic walkthrough videos.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1XW2DDHVa1Qc15NcZ3wUKMFRT7LkyZMCt&sz=w1000',
    badge: '1 Module • 15 Videos',
    totalLessons: 15,
    modules: [
      {
        id: 'lum-mod-1',
        name: 'Lumion Complete Course (15 Videos)',
        lessons: LUMION_LESSONS
      }
    ]
  },

  // 5TH COURSE: Revit Complete Course
  {
    id: 'revit-complete-course',
    title: '5. Revit Complete Course',
    subtitle: 'BIM modeling & Architectural documentation',
    description: 'BIM modeling, architectural documentation, 3D building design, and parametric families in Autodesk Revit.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt&sz=w1000',
    badge: '1 Module • 29 Videos',
    totalLessons: 29,
    modules: [
      {
        id: 'rev-mod-1',
        name: 'Revit Complete Course (29 Videos)',
        lessons: REVIT_LESSONS
      }
    ]
  },

  // 6TH COURSE: Enscape Real-Time Rendering
  {
    id: 'enscape-realtime-rendering',
    title: '6. Enscape Real-Time Rendering',
    subtitle: 'Real-time rendering & VR walkthroughs',
    description: 'Real-time rendering, VR walkthroughs, material editing, and atmospheric lighting in Enscape.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1SmezP6LwT3yo9aE3oivpGkqS-xycSOyx&sz=w1000',
    badge: '1 Module • 4 Videos',
    totalLessons: 4,
    modules: [
      {
        id: 'ens-mod-1',
        name: 'Enscape Complete Course (4 Videos)',
        lessons: ENSCAPE_LESSONS
      }
    ]
  },

  // 7TH COURSE: 3ds Max + V-Ray
  {
    id: '3dsmax-vray-course',
    title: '7. 3ds Max + V-Ray',
    subtitle: 'Professional 3D modeling & V-Ray rendering',
    description: 'Professional 3D modeling, photorealistic V-Ray rendering, interior/exterior visualization in 3ds Max.',
    imageUrl: 'https://drive.google.com/thumbnail?id=1DgmIvkeC2dxGpRpzbIthHQsSdlCty2Xg&sz=w1000',
    badge: '1 Module • 13 Videos',
    totalLessons: 13,
    modules: [
      {
        id: 'max-mod-1',
        name: '3ds Max + V-Ray Complete Course (13 Videos)',
        lessons: TDSMAX_VRAY_LESSONS
      }
    ]
  }
];

export default function StudentPortal() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check existing session
  const [user, setUser] = useState<{ email: string; name: string; trialActive: boolean } | null>(() => {
    const saved = localStorage.getItem('student_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Selected course state (null = show course thumbnail grid view)
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [subStatusInfo, setSubStatusInfo] = useState<{ active: boolean; status: string }>({ active: true, status: 'active' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle returning from Stripe Checkout with success
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const isSuccess = searchParams.get('success') === 'true';

    if (isSuccess && sessionId) {
      const pendingRaw = localStorage.getItem('pending_student_checkout');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending.email) {
            registerStudent({
              email: pending.email,
              phone: pending.phone || '',
              name: pending.name || pending.email.split('@')[0],
              subscriptionId: sessionId
            });

            sendStudentWelcomeEmail({
              studentEmail: pending.email,
              studentName: pending.name || pending.email.split('@')[0],
            });

            const newUser = {
              email: pending.email,
              phone: pending.phone || '',
              name: pending.name || pending.email.split('@')[0],
              trialActive: true
            };
            localStorage.setItem('student_session', JSON.stringify(newUser));
            setUser(newUser);
            localStorage.removeItem('pending_student_checkout');
          }
        } catch (e) {
          console.error('Error restoring pending checkout:', e);
        }
      }
    }
  }, [location.search]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim();
    const trimmedPhone = loginPhone.trim();

    if (!trimmedEmail) {
      setLoginError('Please enter your registered email address.');
      return;
    }

    setLoginLoading(true);

    try {
      const result = await verifyStudentLogin(trimmedEmail, trimmedPhone || undefined);

      if (!result.verified || !result.student) {
        setLoginError(result.reason);
        setLoginLoading(false);
        return;
      }

      // Verified! Create session
      const newUser = {
        email: result.student.email,
        phone: result.student.phone || '',
        name: result.student.name || trimmedEmail.split('@')[0],
        trialActive: result.student.trial_active,
      };

      localStorage.setItem('student_session', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_session');
    setUser(null);
    setSelectedCourse(null);
  };

  const handleSelectCourse = (course: CourseItem) => {
    setSelectedCourse(course);
    if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setSelectedLesson(course.modules[0].lessons[0]);
    }
  };

  // If user is not logged in, show student login form
  if (!user) {
    return (
      <div className="min-h-screen bg-muted/20 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="border-border shadow-2xl overflow-hidden">
            <CardHeader className="bg-zinc-900 text-white p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-3">
                <UserCheck size={24} />
              </div>
              <CardTitle className="text-2xl font-bold">Student Portal Login</CardTitle>
              <p className="text-xs text-zinc-400 mt-1">Enter your registered email address to access your courses</p>
            </CardHeader>

            <CardContent className="p-6">
              {loginError && (
                <div className="p-3 rounded-lg text-xs font-semibold mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Registered Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                    required
                    disabled={loginLoading}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 shadow-lg shadow-orange-600/25"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <><Loader2 size={18} className="animate-spin mr-2" /> Verifying...</>
                  ) : (
                    <>Sign In To Access Courses <ChevronRight size={18} className="ml-1" /></>
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-5 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <ShieldCheck size={14} className="text-orange-500 shrink-0" />
                  <span>We verify your email & phone against our payment records</span>
                </div>
                <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => navigate('/')}>
                  <Sparkles size={14} className="mr-1 text-orange-500" /> Start 3-Day Free Trial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* ═══════ TOP STUDENT HEADER ═══════ */}
      <div className="bg-zinc-900 text-white border-b border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 mb-2">
                <Sparkles size={12} /> 3-DAY FREE TRIAL ACTIVE
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, <span className="text-orange-400 capitalize">{user.name}</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Full unrestricted access to all architecture & rendering masterclasses.</p>
            </div>

            {/* Student Profile Icon & Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-white transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                aria-label="Student Profile"
              >
                <User size={20} className="text-orange-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                    {/* User Info */}
                    <div className="flex items-center gap-3 pb-3 mb-3 border-b border-zinc-800">
                      <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate capitalize">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Hidden Trial Status Badge Inside Profile Menu */}
                    <div className="bg-zinc-800/80 border border-zinc-700/80 p-3 rounded-xl mb-3">
                      <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">TRIAL STATUS</p>
                      <p className="text-xs font-bold text-orange-400 flex items-center gap-1.5 mt-0.5">
                        <Clock size={13} className="shrink-0" /> 72 Hours Remaining
                      </p>
                    </div>

                    {/* Sign Out Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setShowProfileMenu(false); handleLogout(); }} 
                      className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white justify-start"
                    >
                      <LogOut size={14} className="mr-2 text-red-400" /> Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>



      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* ═══════ STEP 1: COURSE THUMBNAIL GRID VIEW ═══════ */}
        {!selectedCourse ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Your Course Library</h2>
              <p className="text-sm text-muted-foreground">Select any course below to watch lessons with DRM anti-download stream protection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {COURSES_PORTAL_DATA.map((course) => (
                <Card 
                  key={course.id} 
                  className="overflow-hidden flex flex-col group border-2 border-border hover:border-orange-500/50 transition-all duration-300 shadow-md hover:shadow-2xl cursor-pointer"
                  onClick={() => handleSelectCourse(course)}
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={12} /> {course.badge}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-xs font-semibold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                        {course.totalLessons} Videos Included
                      </span>
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-600/50">
                        <PlayCircle size={20} className="text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1.5 group-hover:text-orange-600 transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-3">
                        {course.subtitle}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-orange-500" /> Full HD 4K Stream
                      </span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20">
                        Watch Course Videos <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* ═══════ STEP 2: SINGLE COURSE VIDEO PLAYER VIEW ═══════ */
          <div className="space-y-6">
            {/* Back Button & Course Title */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCourse(null)}
                className="text-xs font-bold border-border text-foreground hover:bg-muted"
              >
                <ArrowLeft size={16} className="mr-1.5" /> Back to Course Library
              </Button>
              <span className="text-xs font-semibold text-orange-600 bg-orange-500/10 px-3 py-1 rounded-full">
                {selectedCourse.title}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Cols: Single Video Stream Player */}
              <div className="lg:col-span-2 space-y-6">
                {selectedLesson && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-orange-600 mb-2">
                        <Video size={14} /> Currently Watching
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-2">
                        {selectedLesson.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{selectedLesson.description}</p>
                    </div>

                    {/* Protected Single Video Player */}
                    <SecureVideoPlayer
                      videoUrl={selectedLesson.videoUrl}
                      title={selectedLesson.title}
                      userEmail={user.email}
                    />
                  </>
                )}

                {/* Features & Security Shield Info */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Anti-Download DRM Active:</strong> This video is streaming with single-stream anti-download protection, inspect element blocking, and user session watermark.
                  </div>
                </div>
              </div>

              {/* Right Col: Lessons Checklist for Selected Course */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <BookOpen size={18} className="text-orange-600" /> Course Lessons
                    </h3>
                    <span className="text-xs font-semibold bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-full">
                      {selectedCourse.totalLessons} Videos
                    </span>
                  </div>

                  {/* Module Accordions */}
                  <div className="space-y-4">
                    {selectedCourse.modules.map((module) => (
                      <div key={module.id} className="border border-border/70 rounded-xl overflow-hidden">
                        <div className="bg-muted/40 px-3 py-2.5 font-bold text-xs text-foreground uppercase tracking-wide border-b border-border/50 flex justify-between items-center">
                          <span>{module.name}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">{module.lessons.length} videos</span>
                        </div>

                        <div className="divide-y divide-border/40">
                          {module.lessons.map((lesson) => {
                            const isSelected = selectedLesson?.id === lesson.id;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                                className={`w-full p-3 text-left flex items-start gap-3 transition-all ${
                                  isSelected 
                                    ? 'bg-orange-500/10 border-l-4 border-orange-500 font-semibold' 
                                    : 'hover:bg-muted/50'
                                }`}
                              >
                                <PlayCircle size={16} className={`shrink-0 mt-0.5 ${isSelected ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs leading-snug truncate ${isSelected ? 'text-orange-700 dark:text-orange-300 font-bold' : 'text-foreground'}`}>
                                    {lesson.title}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground mt-0.5 block">{lesson.duration} • HD Stream</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
