interface SectionLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLayout({
  children,
  className = "",
}: SectionLayoutProps) {
  return (
    <div
      className={`flex flex-col items-start lg:items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] lg:max-w-[95svw] xl:max-w-[90svw] 2xl:max-w-[90svw] 3xl:max-w-[60svw] mx-auto px-0 lg:px-4 xl:px-12 py-2 lg:py-16 gap-4 xl:gap-8 ${className}`}
    >
      {children}
    </div>
  );
}
