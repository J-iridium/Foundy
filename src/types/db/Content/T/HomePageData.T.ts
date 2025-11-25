import type { FeaturedData } from "./FeaturedData.T";
import type { FrequentlyAnsweredQuestionsData } from "./FrequentlyAnsweredQuestionsData.T";
import type { HeroData } from "./HeroData.T";
import type { PricingData } from "./PricingData.T";
import type { ReferencesData } from "./ReferenceData.T";

export interface HomePageData {
    hero : HeroData;
    featured : FeaturedData[];
    pricing : PricingData[];
    faq : FrequentlyAnsweredQuestionsData[];
    references : ReferencesData[];
}