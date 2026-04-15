import React from 'react';

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Copyrights 2026 © <span className="gradient-text font-semibold">Advaxe N.</span> | All Rights Reserved.
      </p>
      <div className="flex gap-6">
        {['about', 'skills', 'experience', 'services', 'projects'].map(s => (
          <a key={s} href={`#${s}`} className="nav-link text-xs capitalize">{s}</a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
