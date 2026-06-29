import React from "react";

const base = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

export const Icon = {
  home: (p: any) => <svg {...base} {...p}><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>,
  thread: (p: any) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>,
  dm: (p: any) => <svg {...base} {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
  search: (p: any) => <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>,
  activity: (p: any) => <svg {...base} {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  profile: (p: any) => <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  settings: (p: any) => <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.6 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4 13.4H3.9a2 2 0 1 1 0-4H4a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6h0A1.6 1.6 0 0 0 13.4 4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 19.4 9H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 2z" /></svg>,
  logout: (p: any) => <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>,
  heart: (p: any) => <svg {...base} width={19} height={19} {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  comment: (p: any) => <svg {...base} width={19} height={19} {...p}><path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5z" /></svg>,
  repost: (p: any) => <svg {...base} width={19} height={19} {...p}><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
  share: (p: any) => <svg {...base} width={19} height={19} {...p}><path d="m22 2-7 20-4-9-9-4Z" /></svg>,
  menu: (p: any) => <svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>,
  chevron: (p: any) => <svg {...base} strokeWidth={2.4} {...p}><path d="m9 6 6 6-6 6" /></svg>,
  draft: (p: any) => <svg {...base} {...p}><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M9 13h6M9 17h4" /></svg>,
  dots: (p: any) => <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><circle cx="12" cy="12" r="9.5" /><circle cx="7.5" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="16.5" cy="12" r="1.1" fill="currentColor" stroke="none" /></svg>,
  image: (p: any) => <svg {...base} width={22} height={22} {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="9" r="1.6" /><path d="m21 16-5-5L5 21" /></svg>,
  sticker: (p: any) => <svg {...base} width={22} height={22} {...p}><path d="M14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8l6-6V5a2 2 0 0 0-2-2z" /><path d="M14 21v-5a1 1 0 0 1 1-1h5" /><path d="M8.5 13a3.5 3.5 0 0 0 5 0" /><circle cx="9" cy="9.2" r="0.7" fill="currentColor" /><circle cx="14.5" cy="9.2" r="0.7" fill="currentColor" /></svg>,
  gif: (p: any) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}><rect x="2.5" y="6" width="19" height="12" rx="3" /><text x="12" y="15.2" fontSize="6.6" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Arial">GIF</text></svg>,
  music: (p: any) => <svg {...base} width={22} height={22} {...p}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>,
  // settings list
  followInvite: (p: any) => <svg {...base} {...p}><circle cx="9" cy="8" r="4" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0" /><path d="M19 7v6M22 10h-6" /></svg>,
  bell: (p: any) => <svg {...base} {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>,
  bookmark: (p: any) => <svg {...base} {...p}><path d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  heartLine: (p: any) => <svg {...base} {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  archive: (p: any) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" /><path d="M10 12h4" /></svg>,
  lock: (p: any) => <svg {...base} {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
  sliders: (p: any) => <svg {...base} {...p}><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" /><circle cx="9" cy="8" r="2.3" fill="var(--bg)" /><circle cx="15" cy="16" r="2.3" fill="var(--bg)" /></svg>,
  note: (p: any) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 9h8M8 13h6" /></svg>,
  help: (p: any) => <svg {...base} {...p}><circle cx="12" cy="12" r="9.5" /><path d="M9.6 9.2a2.5 2.5 0 0 1 4.3 1.6c0 1.6-2 1.9-2 3.2" /><circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" /></svg>,
  about: (p: any) => <svg {...base} {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 11v5.5" /><circle cx="12" cy="7.8" r="0.8" fill="currentColor" stroke="none" /></svg>,
};
