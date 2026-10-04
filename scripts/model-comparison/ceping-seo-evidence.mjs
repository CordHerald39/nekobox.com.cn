// Public evidence only. No transport, secrets, account data or paid execution.
export const evidence=[
  {url:'https://www.cepingjichang.com/',facts:[
    '公开首页 HTTP 200，canonical 为 https://www.cepingjichang.com/。',
    '实时 HTML title 为“机场测评｜官网辨别、优惠信息与客户端下载指南”，H1 为“机场测评，先核验再选择。”。',
    '实时 description 已说明第三方信息指南、分类浏览、核对域名与时效，以及实际速度和稳定性需自行验证。不要把较早的网页文本快照当作当前首页文案。'
  ]},
  {url:'https://www.cepingjichang.com/blog',facts:[
    '公开文章中心显示 4816 篇，分页共 201 页；这些是页面显示的内容计数，不是流量或索引数量。',
    '已有机场测评、官网辨别、优惠价格、客户端下载、教程排障五个分类入口，以及代理软件、海外 App、机场服务三个专题入口。',
    '本次仅抽查近期文章，不代表已经审计全部文章。'
  ]},
  {url:'https://www.cepingjichang.com/category/reviews',facts:[
    '公开机场测评分类页面显示 2029 篇。首页列出的腾龙加速器注册教程也出现在这一分类。',
    '分类描述涉及适用人群、稳定性、功能和选择标准；不能据此声称具体文章已有真实测速。'
  ]},
  {url:'https://www.cepingjichang.com/blog/tenglong-accelerator-registration-tutorial',facts:[
    '页面标题围绕腾龙加速器注册教程、第三方测评、辨别核验和适用场景，正文声明不提供注册地址、兑换码或价格承诺。',
    '正文主要为名称辨别、域名与条款检查，没有对应服务的经核验注册步骤或真实测速数据。',
    '现有内链指向 VPN 注册教程、Mosu 注册教程及全部指南；内链相关性需要按具体用户任务判断。'
  ]},
  {url:'https://www.cepingjichang.com/blog/gcp-registration-tutorial',facts:[
    '页面讨论 Google Cloud Platform 与同名非谷歌服务的区别，混合注册准备和通用核验建议，分类显示常见问题。',
    '现有内链包含 VPN 注册教程与出口注册教程。公开参考资料仅列 Google 账号创建帮助页。',
    '本次没有核实具体服务入口、当前 Google Cloud 优惠或支付支持范围；不得新增这些事实。'
  ]},
  {url:'https://developers.google.com/search/docs/appearance/title-link',facts:[
    'Google 建议每页有描述性、简洁且能区分页面内容的标题，避免堆词和仅替换一个词的重复模板。',
    'Google 会自动生成搜索结果标题；站点修改不能保证固定展示或排名提升。'
  ]},
  {url:'https://developers.google.com/search/docs/appearance/snippet',facts:[
    'Google 建议写准确描述具体页面内容的独特 description，也可能从正文生成摘要。',
    'description 并不保证被完整采用或直接提高排名。'
  ]},
  {url:'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',facts:[
    'Google 强调原创价值、准确性、读者任务和清楚的内容生产方式。',
    '测评应说明实测对象、方法与证据，不得虚构测试、作者资历、流量或排名。'
  ]}
];
export const focusedEvidence=[
  {url:'https://www.cepingjichang.com/category/official',facts:['现有 H1 为官网辨别，描述为核对官网入口、域名、品牌身份与常见仿冒风险。','该公开页面 HTTP 200；不代表文章中的品牌官网已经核验。']},
  {url:'https://www.cepingjichang.com/category/downloads',facts:['现有 H1 为客户端下载，描述覆盖代理客户端、海外应用下载、安装和系统兼容。','该公开页面 HTTP 200；页面主题可以按项目发行页、架构、版本和文件来源展开，不虚构下载地址。']},
  {url:'https://www.cepingjichang.com/topics/proxy-clients',facts:['该公开页面 HTTP 200，现有专题聚合 Clash、Shadowrocket、V2Ray、sing-box、Surge。','按下载、配置、排障三类用户任务组织内链是待评估建议，不是当前已完成的结构。']},
  ...evidence.slice(-3)
];
export const prompt='No tools or browsing. Use ONLY the verified public website and Google Search Central evidence below. Produce a practical Chinese SEO implementation brief focused ONLY on /category/official, /category/downloads, and /topics/proxy-clients: exact title, description, 80–120 Chinese character introduction, a short user checklist, and task-relevant internal-link suggestions for each. Distinguish existing facts from proposals; only evidence URLs can be presented as verified existing destinations, otherwise mark the target proposed. Preserve already-correct content. Never invent traffic, keyword volume, rankings, real service tests, prices, official service URLs or author credentials. No ranking guarantees. Cite exact public evidence URLs. Keep 1000–1500 Chinese characters and finish all three pages. PUBLIC_EVIDENCE='+JSON.stringify(focusedEvidence);
