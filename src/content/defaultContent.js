import { assetUrl } from '@/utils/assetUrl'

export const defaultContent = {
  documents: {
    cv: {
      title: 'CV - Gatuzo',
      url: '',
      updatedAt: '',
    },
    certificates: [],
  },
  projects: [
    {
      id: 'rosy-music-bot',
      name: 'Rosy Music Bot',
      icon: assetUrl('icons/project-bot.svg'),
      description:
        'Bot de Discord avanzado para reproducción de música con soporte de múltiples plataformas.',
      fullDescription:
        'Bot de Discord avanzado para reproducción de música con soporte para múltiples plataformas de streaming. Incluye sistema de cola, control de volumen, filtros de audio y búsqueda de canciones.',
      tech: ['Discord.js', 'Node.js', 'MongoDB', 'YouTube API'],
      github: 'https://github.com/GatuzoCXL/Rosy-Music-Bot',
      screenshots: [
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504340/rosy1_lhnuer.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504340/rosy2_hnia8g.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504341/rosy3_ozttwp.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504341/rosy4_mzmsw8.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504341/rosy5_lpazdw.png',
      ],
      videos: [],
    },
    {
      id: 'joya-express',
      name: 'Joya Express',
      icon: assetUrl('icons/project-box.svg'),
      description:
        'Aplicación móvil para gestión de entregas en tiempo real con seguimiento en vivo.',
      fullDescription:
        'Aplicación móvil para gestión de entregas en tiempo real. Sistema completo de seguimiento de paquetes, notificaciones en vivo y estadísticas detalladas para operadores y clientes.',
      tech: ['React Native', 'Node.js', 'Firebase', 'Google Maps API'],
      github: null,
      demo: null,
      screenshots: [
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504342/joya1_gko2we.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504342/joya2_uw44vj.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504343/joya3_iww7uc.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504343/joya4_l2voza.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504343/joya5_ngw1zt.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504343/joya6_ipkhgk.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504344/joya7_svl9ta.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504344/joya8_cul7ni.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504344/joya9_rdwmuf.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504344/joya10_qkmubs.png',
      ],
      videos: [],
    },
    {
      id: 'metal-corp',
      name: 'New Corp (Metal Corp)',
      icon: assetUrl('icons/project-globe.svg'),
      description: 'Página web corporativa para empresa de metalurgia con diseño responsivo.',
      fullDescription:
        'Página web corporativa moderna con diseño responsivo. Portafolio de servicios, galería de proyectos y sistema de contacto integrado para empresa de metalurgia.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      github: 'https://github.com/GatuzoCXL/metal-corp',
      demo: 'https://gatuzocxl.github.io/metal-corp/',
      screenshots: [
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504339/newcorp1_m3ok9o.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504339/newcorp2_k97bfw.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504340/newcorp3_lgnfl2.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504340/newcorp4_hxwwmm.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504340/newcorp5_gukcci.png',
      ],
      videos: [],
    },
    {
      id: 'crosshair-gasu',
      name: 'Crosshair Gasu',
      icon: assetUrl('icons/project-crosshair.svg'),
      description: 'Herramienta de personalización de crosshairs para juegos competitivos.',
      fullDescription:
        'Aplicación de escritorio para juegos. Herramienta de personalización de crosshairs (retículas) para mejorar la puntería en juegos competitivos. Incluye múltiples estilos y configuraciones.',
      tech: ['Electron', 'React', 'Node.js', 'Canvas API'],
      github: 'https://github.com/GatuzoCXL/crosshairGasu',
      release: 'https://github.com/GatuzoCXL/crosshairGasu/releases/tag/v1.0.0',
      screenshots: [
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504341/crosshair1_dliiov.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504342/crosshair2_da9ndb.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504342/crosshair3_iatfyh.png',
        'https://res.cloudinary.com/duct39o42/image/upload/v1775504342/crosshair4_hv7ngp.png',
      ],
      videos: [],
    },
  ],
}
