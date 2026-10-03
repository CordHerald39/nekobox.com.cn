// Curated next steps for the existing guides; unavailable or unpublished pages are omitted.
export const relatedArticleSlugs={
 'choose-client':['nekobox-migration','nekobox-release-notes','import-subscription'],
 'import-subscription':['nekobox-formats','nekobox-subscription-update-failed','service-checklist'],
 'nekobox-formats':['import-subscription','nekobox-subscription-update-failed','nekobox-migration'],
 'nekobox-subscription-update-failed':['import-subscription','nekobox-formats','nekobox-dns-troubleshooting'],
 'nekobox-app-routing':['troubleshooting','nekobox-dns-troubleshooting','nekobox-background-disconnect'],
 'troubleshooting':['nekobox-app-routing','nekobox-dns-troubleshooting','nekobox-background-disconnect'],
 'nekobox-dns-troubleshooting':['troubleshooting','nekobox-app-routing','nekobox-subscription-update-failed'],
 'nekobox-background-disconnect':['troubleshooting','nekobox-app-routing','nekobox-dns-troubleshooting'],
 'nekobox-install-failed':['nekobox-release-notes','choose-client','nekobox-migration'],
 'nekobox-release-notes':['nekobox-install-failed','nekobox-formats','nekobox-migration'],
 'nekobox-migration':['choose-client','nekobox-formats','nekobox-install-failed'],
 'service-checklist':['import-subscription','review-method','coupon-check'],
 'ranking-method':['review-method','service-checklist','troubleshooting'],
 'review-method':['ranking-method','service-checklist','nekobox-app-routing'],
 'coupon-check':['service-checklist','review-method','ranking-method']
};

export function selectRelatedArticles(current,articles){
 const available=new Map(articles.map(a=>[a.slug,a]));
 return [...new Set(relatedArticleSlugs[current.slug]||[])]
  .filter(slug=>slug!==current.slug&&available.has(slug))
  .map(slug=>available.get(slug));
}
