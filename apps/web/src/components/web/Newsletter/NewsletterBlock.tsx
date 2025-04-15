import NewsletterForm from "../Forms/NewsletterForm";

export default function NewsletterBlock() {
    return (
        <div className="flex flex-col items-start lg:items-center rounded-b-xl max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-16 gap-4 xl:gap-8">
            <div className="flex flex-col items-start lg:items-center gap-8 border border-white/10 py-20 px-8 rounded-xl">
                <h2 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[70%]">Latest of news, insights & info straight into your inbox</h2>
                <p className="text-lg text-left lg:text-center w-full lg:w-[70%] text-white/70">
                    Discover a world of exclusive luxury living with our curated selection of branded residences. Subscribe for expert insights, latest trends, and in-depth property reviews—delivered straight to your inbox.
                </p>
                <NewsletterForm />
            </div>
        </div>
    );
}