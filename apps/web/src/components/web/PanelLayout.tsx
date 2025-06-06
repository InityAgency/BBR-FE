interface PanelLayoutProps {
    children: React.ReactNode;
    className?: string; 
  }
  
  export default function PanelLayout({ children, className = "" }: PanelLayoutProps) {
    return (
      <div className={`flex flex-col items-start lg:items-center max-w-[calc(100vw-1.5rem)] 2xl:max-w-[calc(100vw-4rem)] mx-auto pt-0 lg:pt-4 py-4 lg:py-8 px-0 lg:px-0 ${className}`}>
        {children}
      </div>
    );
  }

  