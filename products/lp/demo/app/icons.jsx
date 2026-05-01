// SVG icon library for mitooshi (per DESIGN_SPEC §6)
// All icons share stroke 1.8, round caps, no fill.

const Icon = ({ name, size = 22, stroke = 'currentColor', fill = 'none', strokeWidth = 1.8, ...rest }) => {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    ...rest,
  };
  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9"/></svg>;
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case 'palette':
      return <svg {...common}><path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.5 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.8.7-1.5 1.5-1.5H16a5 5 0 005-5c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2" fill={stroke} stroke="none"/><circle cx="9.5" cy="6.5" r="1.2" fill={stroke} stroke="none"/><circle cx="14.5" cy="6.5" r="1.2" fill={stroke} stroke="none"/><circle cx="17" cy="11" r="1.2" fill={stroke} stroke="none"/></svg>;
    case 'camera':
      return <svg {...common}><path d="M3 8a2 2 0 012-2h2.5l1.5-2h6l1.5 2H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'pencil':
      return <svg {...common}><path d="M16.5 3.5l4 4-12 12H4.5v-4l12-12z"/><path d="M14 6l4 4"/></svg>;
    case 'trash':
      return <svg {...common}><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/><path d="M10 11v7M14 11v7"/></svg>;
    case 'chevron-right':
      return <svg {...common}><path d="M9 5l7 7-7 7"/></svg>;
    case 'chevron-left':
      return <svg {...common}><path d="M15 5l-7 7 7 7"/></svg>;
    case 'chevron-down':
      return <svg {...common}><path d="M5 9l7 7 7-7"/></svg>;
    case 'menu':
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'check':
      return <svg {...common}><path d="M4 12l5 5L20 6"/></svg>;
    case 'text':
      return <svg {...common}><path d="M5 5h14M12 5v14M8 19h8"/></svg>;
    case 'star':
      return <svg {...common}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.5l6.1-.9L12 3z"/></svg>;
    case 'sparkle':
      return <svg {...common}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></svg>;
    case 'bell':
      return <svg {...common}><path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 004 0"/></svg>;
    case 'diamond':
      return <svg {...common}><path d="M12 3l9 6-9 12-9-12 9-6z"/><path d="M3 9h18M12 3v18"/></svg>;
    case 'doc':
      return <svg {...common}><path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M14 3v5h5"/><path d="M9 14h6M9 17h6"/></svg>;
    case 'mail':
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'image':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/></svg>;
    case 'arrow-left':
      return <svg {...common}><path d="M5 12h14M5 12l6-6M5 12l6 6"/></svg>;
    default:
      return null;
  }
};

window.Icon = Icon;
