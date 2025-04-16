export default function SectionLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-start lg:items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] lg:max-w-[95svw] xl:max-w-[90svw] 2xl:max-w-[90svw] 3xl:max-w-[60svw] mx-auto px-2 lg:px-4 xl:px-12 py-8 lg:py-16 gap-4 xl:gap-8">
            {children}
        </div>
    )
}