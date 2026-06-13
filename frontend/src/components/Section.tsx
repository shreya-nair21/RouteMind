import React from 'react';

export function Section({
  children,
  id,
  className = '',
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`px-6 md:px-12 lg:px-16 py-32 relative ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
  className = '',
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-16 max-w-3xl ${className}`}>
      {subtitle && (
        <p className="text-gray-400 mb-3 text-sm font-medium tracking-[0.1em] uppercase">
          {subtitle}
        </p>
      )}

      <h2
        className="text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em] font-normal text-white font-sans leading-tight"
      >
        {title}
      </h2>
    </div>
  );
}
