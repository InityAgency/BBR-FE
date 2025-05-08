interface PanelLayoutProps {
    children: React.ReactNode;
    className?: string; 
  }
  
  export default function PanelLayout({ children, className = "" }: PanelLayoutProps) {
    return (
      <div className={`flex flex-col items-start lg:items-center max-w-[calc(100vw-1.5rem)] 2xl:max-w-[calc(100vw-4rem)] mx-auto py-8 lg:py-4 px-4 lg:px-0 ${className}`}>
        {children}
      </div>
    );
  }

  