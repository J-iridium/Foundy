import type { FeaturedData } from "./FeaturedData.T";
import type { FrequentlyansweredquestionsData } from "./FrequentlyansweredquestionsData.T";
import type { HeroData } from "./HeroData.T";
import type { PricingData } from "./PricingData.T";
import type { ReferenceData } from "./ReferenceData.T";


export interface HomepageData {
    hero : HeroData;
    featured : FeaturedData[];
    pricing : PricingData[];
    faq : FrequentlyansweredquestionsData[];
    references : ReferenceData[];
}