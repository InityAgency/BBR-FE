import { RankingCategory, RankingCategoryFormData } from "@/app/types/models/RankingCategory";

/**
 * Priprema podatke za prikaz u formi pretvaranjem API odgovora 
 * u format koji očekuje forma
 */
export const apiToFormRankingCategory = (apiData: RankingCategory): RankingCategoryFormData => {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    status: apiData.status,
    rankingCategoryTypeId: apiData.rankingCategoryType?.id || "",
    residenceLimitation: apiData.residenceLimitation,
    rankingPrice: typeof apiData.rankingPrice === 'string' 
      ? parseFloat(apiData.rankingPrice) 
      : (apiData.rankingPrice as unknown as number),
    featuredImageId: apiData.featuredImage?.id,
    entityId: (apiData.entity as any)?.id,
    entity: apiData.entity as any,
    title: apiData.title
  };
};

/**
 * Priprema podatke za slanje na API pretvaranjem podataka iz forme
 * u format koji očekuje API
 */
export const formToApiRankingCategory = (formData: RankingCategoryFormData): Partial<RankingCategory> => {
  // Ova funkcija bi se koristila ako API zahteva drugačiju strukturu
  // pri slanju podataka u odnosu na ono što prima.
  
  // Trenutno je API konzistentan pa samo prosleđujemo podatke
  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    status: formData.status,
    rankingPrice: formData.rankingPrice.toString(),
    residenceLimitation: formData.residenceLimitation
    // Ostali podaci se šalju odvojeno (featuredImageId, rankingCategoryTypeId)
  };
};