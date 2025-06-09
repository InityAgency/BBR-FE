import Link from "next/link";

// #region Titles
const FreeTitle = () => {
  return (
    <div className="flex flex-col lg:gap-[16px]">
      <h1 className="text-[16px] lg:text-[36px] text-[#171D22] !font-medium">
        Free
      </h1>
      <p className="text-[#171D22] text-[12px] lg:text-[16px]">Starter plan</p>
    </div>
  );
};

const PremiumTitle = () => {
  return (
    <div className="flex flex-col lg:gap-[16px]">
      <h1 className="text-[16px] lg:text-[36px] text-primary !font-medium">
        Premium
      </h1>
      <p className="text-[#171D22] text-[12px] lg:text-[16px]">1,500 $/month</p>
    </div>
  );
};

const BespokeTitle = () => {
  return (
    <div className="flex flex-col lg:gap-[16px]">
      <h1 className="text-[16px] lg:text-[36px] text-[#171D22] !font-medium">
        Bespoke
      </h1>
      <p className="text-[#171D22] text-[12px] lg:text-[16px]">Custom plan</p>
    </div>
  );
};
// #endregion

// #region Overview
const OverviewTitle = () => {
  return (
    <p className="text-[#252430] font-bold text-[12px] lg:text-[18px] text-center">
      Overview
    </p>
  );
};

const OverviewFree = () => {
  return (
    <p className="text-[#252430] text-[12px] lg:text-[18px]">
      BThe Basic Plan is ideal for developers who are just starting out and want
      to showcase their properties without upfront costs. It's designed to give
      you a foundational presence on the platform, enabling you to list your
      branded residences.
    </p>
  );
};

const OverviewPremium = () => {
  return (
    <p className="text-[#252430] text-[12px] lg:text-[18px]">
      BThe Basic Plan is ideal for developers who are just starting out and want
      to showcase their properties without upfront costs. It's designed to give
      you a foundational presence on the platform, enabling you to list your
      branded residences.
    </p>
  );
};
const OverviewBespoke = () => {
  return (
    <p className="text-[#252430] text-[12px] lg:text-[18px]">
      BThe Basic Plan is ideal for developers who are just starting out and want
      to showcase their properties without upfront costs. It's designed to give
      you a foundational presence on the platform, enabling you to list your
      branded residences.
    </p>
  );
};
// #endregion

// #region What do you get?
const WhatDoYouGetTitle = () => {
  return (
    <p className="text-[#252430] font-bold text-[12px] lg:text-[18px] text-center">
      What You Get?
    </p>
  );
};

const WhatDoYouGetFree = () => {
  return (
    <div>
      <div>
        <p className="text-[#252430] text-[12px] lg:text-[18px] font-medium">
          • Featured Property Placement
        </p>
        <p className="text-[#252430] text-[12px] lg:text-[18px] mt-2 mb-2">
          Your listings receive premium visibility across the platform including
          priority placement in search results and curated collections ensuring
          they stand out to discerning buyers.
        </p>
      </div>
      <div>
        <p className="text-[#252430] text-[12px] lg:text-[18px] font-medium">
          • Direct Lead Access
        </p>
        <p className="text-[#252430] text-[12px] lg:text-[18px] mt-2 mb-2">
          Gain full access to verified buyer inquiries and connect directly with
          interested prospects to accelerate your sales pipeline.
        </p>
      </div>
    </div>
  );
};

const WhatDoYouGetPremium = () => {
  return (
    <div>
      <div>
        <p className="text-[#252430] text-[12px] lg:text-[18px] font-medium">
          • Featured Property Placement
        </p>
        <p className="text-[#252430] text-[12px] lg:text-[18px] mt-2 mb-2">
          Your listings receive premium visibility across the platform including
          priority placement in search results and curated collections ensuring
          they stand out to discerning buyers.
        </p>
      </div>
      <div>
        <p className="text-[#252430] text-[12px] lg:text-[18px] font-medium">
          • Direct Lead Access
        </p>
        <p className="text-[#252430] text-[12px] lg:text-[18px] mt-2 mb-2">
          Gain full access to verified buyer inquiries and connect directly with
          interested prospects to accelerate your sales pipeline.
        </p>
      </div>
    </div>
  );
};

const WhatDoYouGetBespoke = () => {
  return (
    <div>
      <div>
        <p className="text-[#252430] text-[12px] lg:text-[18px] font-medium">
          • Featured Property Placement
        </p>
        <p className="text-[#252430] text-[12px] lg:text-[18px] mt-2 mb-2">
          Your listings receive premium visibility across the platform including
          priority placement in search results and curated collections ensuring
          they stand out to discerning buyers.
        </p>
      </div>
      <div>
        <p className="text-[#252430] text-[12px] lg:text-[18px] font-medium">
          • Direct Lead Access
        </p>
        <p className="text-[#252430] text-[12px] lg:text-[18px] mt-2">
          Gain full access to verified buyer inquiries and connect directly with
          interested prospects to accelerate your sales pipeline.
        </p>
      </div>
    </div>
  );
};
// #endregion

// #region What's it for?
const WhatItsForTitle = () => {
  return (
    <p className="text-[#252430] font-bold text-[12px] lg:text-[18px] text-center">
      Who It's For?
    </p>
  );
};

const WhatItsForFree = () => {
  return (
    <p className="text-[#252430] text-[12px] lg:text-[18px]">
      Developers with limited marketing budgets looking to gain initial
      exposure. Those wanting to test the platform before upgrading to premium
      features. Ideal for developers focused on getting started without the need
      for immediate leads.{" "}
    </p>
  );
};
const WhatItsForPremium = () => {
  return (
    <p className="text-[#252430] text-[12px] lg:text-[18px]">
      Developers with limited marketing budgets looking to gain initial
      exposure. Those wanting to test the platform before upgrading to premium
      features. Ideal for developers focused on getting started without the need
      for immediate leads.{" "}
    </p>
  );
};
const WhatItsForBespoke = () => {
  return (
    <p className="text-[#252430] text-[12px] lg:text-[18px]">
      Developers with limited marketing budgets looking to gain initial
      exposure. Those wanting to test the platform before upgrading to premium
      features. Ideal for developers focused on getting started without the need
      for immediate leads.{" "}
    </p>
  );
};
// #endregion

// #region Buttons
const FreeLink = () => {
  return (
    <Link
      href="/#"
      className="text-[10px] lg:text-[14px] place-self-center flex justify-center lg:h-[40px] w-full text-center items-center text-black bg-[#F5F5F4] rounded-md p-2 text-black"
    >
      Get started for free
    </Link>
  );
};
const PremiumLink = () => {
  return (
    <Link
      href="/#"
      className="text-[10px] lg:text-[14px] place-self-center flex justify-center lg:h-[40px] w-full text-center items-center text-white bg-primary rounded-md p-2 text-black"
    >
      Get started for free
    </Link>
  );
};
const BespokeLink = () => {
  return (
    <Link
      href="/#"
      className="text-[10px] lg:text-[14px] place-self-center flex justify-center lg:h-[40px] w-full text-center items-center text-black bg-[#F5F5F4] rounded-md p-2 text-black"
    >
      Schedule a call
    </Link>
  );
};
// #endregion

const PlanOverview = () => {
  return (
    <div>
      <div className="min-h-screen flex">
        <div className="grid grid-cols-4">
          <div className="border rounded-tl-xl border-gray-200 p-[2px] text-justify" />

          <div className="border border-gray-200 p-[2px] lg:p-[2px] md:p-[14px] lg:p-[16px] text-justify">
            <FreeTitle />
          </div>
          <div className="border border-gray-200 p-[2px] lg:p-[2px] md:p-[14px] lg:p-[16px] text-justify">
            <PremiumTitle />
          </div>
          <div className="border rounded-tr-xl border-gray-200 p-[2px] lg:p-[2px] md:p-[14px] lg:p-[16px] text-justify">
            <BespokeTitle />
          </div>

          <div className="border border-gray-200 p-[2px] lg:p-[2px] md:p-[14px] lg:p-[16px] text-justify">
            <OverviewTitle />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px] ">
            <OverviewFree />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <OverviewPremium />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <OverviewBespoke />
          </div>

          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatDoYouGetTitle />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatDoYouGetFree />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatDoYouGetPremium />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatDoYouGetBespoke />
          </div>

          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatItsForTitle />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatItsForFree />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatItsForPremium />
          </div>
          <div className="border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <WhatItsForBespoke />
          </div>

          <div className="border rounded-bl-xl border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]" />
          <div className="flex border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <FreeLink />
          </div>
          <div className="flex border border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <PremiumLink />
          </div>
          <div className="flex border rounded-br-xl border-gray-200 p-[2px] md:p-[14px] lg:p-[16px]">
            <BespokeLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanOverview;
