/*
 * TEMPORARY: the copy variations the team is comparing. The switcher in the
 * bottom-left corner flips between them. To add a variation, add an entry
 * with the same shape; to settle on one, inline its text and delete this
 * folder plus CopySwitcher.
 *
 * Headings are { a, b, br }: `a` in the base colour, `b` in orange, and `br`
 * puts them on separate lines.
 *
 * Platform cards name a `visual` from Stack.jsx: models, memory, context,
 * tokens, agents, uncensored.
 */

const v1 = {
  name: 'Current',
  title: 'OpenLedger — Private access to every AI model',
  nav: { privacy: 'Privacy', stack: 'Platform', heyopen: 'HeyOpen', ecosystem: 'Ecosystem', built: 'Protocol', backed: 'Investors', cta: 'Try HeyOpen' },
  hero: {
    eyebrow: 'OpenLedger',
    h: { a: 'Private access', b: 'to every AI model.', br: true },
    sub: 'Every request leaves your device without your identity attached. On supported routes, it’s encrypted end to end, processed inside a hardware-isolated enclave, and never stored.',
    cta: 'Try HeyOpen',
    line: ['No account to start', 'Privacy labeled on every model', 'Enclave-backed routes'],
  },
  privacy: {
    label: 'Privacy',
    h: { a: 'Four protections,', b: 'labeled on every model.', br: true },
    sub: 'Before you send anything, HeyOpen shows which protections a model’s route provides, so you can choose the level your work needs.',
    items: [
      { title: 'Anonymous routing', body: 'Your identity never reaches the model provider. They see the request, not who sent it.' },
      { title: 'Zero data retention', body: 'Prompts and responses aren’t written to storage after processing, and they’re never used to train models.' },
      { title: 'Confidential compute (TEE)', body: 'The model runs inside a hardware-isolated enclave. Infrastructure operators can’t read your prompt while it’s processed.' },
      { title: 'End-to-end encryption (E2EE)', body: 'Your prompt is encrypted before it leaves your device and decrypted only inside a verified enclave.' },
    ],
    note: 'Protections vary by route. Every model in HeyOpen carries its labels, so you know exactly what you’re getting.',
  },
  platform: {
    label: 'Platform',
    h: { a: 'Every leading model.', b: 'One private front door.' },
    sub: 'Switch models mid-conversation, keep one memory across all of them, and run agents, all on the same private routes.',
    cards: [
      { visual: 'models', label: 'Models', title: '200+ models, each labeled.', body: 'Proprietary and open-weight models side by side, with each one’s privacy level shown before you send.' },
      { visual: 'memory', label: 'Universal memory', title: 'One memory across every model.', body: 'Preferences, projects, and history follow you when you switch. You choose what each model can read.' },
      { visual: 'tokens', label: 'Routing', title: 'Pick a model, or let routing pick.', body: 'Each request can be matched to a capable model at the lowest token cost.' },
      { visual: 'agents', label: 'Agents + x402', title: 'Agents that can pay their way.', body: 'Agents call tools and paid APIs on your behalf. x402 settles each call automatically.' },
      { visual: 'uncensored', label: 'Uncensored', title: 'Uncensored models, clearly labeled.', body: 'HeyOpen doesn’t add its own filtering on supported routes. Moderation comes from the model you pick.' },
    ],
  },
  heyopen: {
    label: 'HeyOpen',
    h: { a: 'Ask anything,', b: 'without signing up.', br: true },
    lead: 'HeyOpen brings every leading model, your memory, and your agents into one place. Start with no account, connect a wallet when you want more, and switch models without starting over.',
    cta: 'Try HeyOpen',
    open: {
      h: { a: 'Powered by', b: 'OPEN.' },
      body: 'OPEN is OpenLedger’s native token. It powers model access, memory, agents, and x402 payments across HeyOpen.',
    },
  },
  ecosystem: {
    label: 'Ecosystem',
    h: { a: 'Partners across', b: 'AI and infrastructure.' },
    sub: 'Model, compute, wallet, and application partners working with OpenLedger.',
  },
  protocol: {
    label: 'Protocol',
    h: { a: 'Verifiable', b: 'by design.' },
    sub: 'OpenLedger is an EVM-compatible chain that records which data, models, and contributors shaped an AI result, and rewards them through Proof of Attribution.',
    items: [
      { title: 'Built for AI workloads', body: 'Designed around the full AI lifecycle, from training data to deployed agents.' },
      { title: 'AI as on-chain assets', body: 'Datasets, models, and agents can be owned, combined, and built on.' },
      { title: 'EVM-compatible', body: 'Use the Ethereum wallets, contracts, and tooling you already have.' },
      { title: 'Proof of Attribution', body: 'Each contribution to a model is recorded on-chain, so the people behind it are credited and rewarded.' },
    ],
  },
  investors: {
    label: 'Investors',
    h: { a: 'Backed by leading investors', b: 'in AI and crypto.' },
  },
  cta: {
    h: { a: 'Ask your first question', b: 'privately.', br: true },
    sub: 'No account and no setup. Pick a model, check its privacy label, and ask.',
    cta: 'Try HeyOpen',
  },
};

const v2 = {
  name: 'Private AI. Without limits.',
  title: 'OpenLedger — Private AI. Without limits.',
  nav: { privacy: 'Privacy', stack: 'Models', heyopen: 'HeyOpen', ecosystem: 'Ecosystem', built: 'Infrastructure', backed: 'Backers', cta: 'Meet HeyOpen' },
  hero: {
    eyebrow: 'OpenLedger',
    h: { a: 'Private AI.', b: 'Without limits.', br: true },
    sub: '200+ AI models. Private routing. Confidential compute. One place to access AI without giving up control of your data.',
    cta: 'Meet HeyOpen',
    line: ['Private by architecture.', 'Open by choice.'],
  },
  privacy: {
    label: 'Privacy',
    h: { a: 'Four levels of privacy.', b: 'Labeled per route.', br: true },
    sub: 'Each route is labeled with what it actually provides, so you can pick a model by the privacy your work needs.',
    items: [
      { title: 'Anonymous', body: 'The provider receives your prompt to answer it, but never learns who sent it.' },
      { title: 'Zero retention', body: 'Prompts and responses are discarded once the request completes, and never used for training.' },
      { title: 'TEE', body: 'Your prompt is processed inside a hardware-isolated enclave the operator can’t inspect.' },
      { title: 'E2EE', body: 'Encrypted on your device. Only a verified enclave can decrypt it.' },
    ],
  },
  platform: {
    label: 'Models',
    h: { a: 'Every leading model.', b: 'One private front door.', br: true },
    sub: 'Access 200+ AI models, keep context across conversations, and choose how your requests are processed.',
    cards: [
      { visual: 'models', title: '200+ AI Models', body: 'Switch between leading models through one experience.' },
      { visual: 'memory', title: 'Universal Memory', body: 'Keep context across models without starting over.' },
      { visual: 'context', title: 'Private Context', body: 'Control what gets remembered and shared with each model.' },
      { visual: 'tokens', title: 'Token Optimization', body: 'Match tasks to suitable models and reduce unnecessary token usage.' },
      { visual: 'uncensored', title: 'Uncensored Models', body: 'Choose models that allow more open-ended conversations.' },
      { visual: 'agents', title: 'Agents + x402', body: 'Connect AI agents to tools and services with automated payment support.' },
    ],
  },
  heyopen: {
    label: 'HeyOpen',
    h: { a: 'All your AI.', b: 'One private space.', br: true },
    lead: '200+ models, Universal Memory, and uncensored options in one experience. Switch models without losing context or giving up control.',
    cta: 'Meet HeyOpen',
    open: {
      h: { a: 'Powered by', b: 'OPEN.' },
      body: 'OPEN connects model access, memory, agents, and premium AI capabilities across HeyOpen, including x402-enabled transactions.',
    },
  },
  ecosystem: {
    label: 'Ecosystem',
    h: { a: 'Expanding AI.', b: 'Expanding possibilities.', br: true },
    sub: 'An ecosystem of partners across AI, privacy technology, and Web3.',
  },
  protocol: {
    label: 'Infrastructure',
    h: { a: 'Open standards.', b: 'Verifiable foundations.', br: true },
    sub: 'Infrastructure for AI applications, agents, and programmable access, built around interoperability and verification.',
    items: [
      { title: 'AI-Native Infrastructure', body: 'Built to support AI models, applications, and autonomous agents.' },
      { title: 'EVM Compatibility', body: 'Integrate with Ethereum-compatible applications and smart contracts.' },
      { title: 'Proof of Attribution', body: 'Verify contributions across AI data and models.' },
      { title: 'Programmable Access', body: 'Enable API integrations and x402-powered agent transactions.' },
    ],
  },
  investors: {
    label: 'Backed & Supported',
    h: { a: 'Backed by leaders', b: 'in AI and crypto.', br: true },
  },
  cta: {
    h: { a: 'More AI.', b: 'Less exposure.', br: true },
    sub: 'Access leading models through one privacy-first experience.',
    cta: 'Meet HeyOpen',
  },
};

const v3 = {
  name: 'The future of private AI',
  title: 'OpenLedger — AI without limits. Privacy built in.',
  nav: { privacy: 'Privacy', stack: 'Capabilities', heyopen: 'HeyOpen', ecosystem: 'Ecosystem', built: 'Foundation', backed: 'Backers', cta: 'Meet HeyOpen' },
  hero: {
    eyebrow: 'The future of private AI',
    h: { a: 'AI without limits.', b: 'Privacy built in.', br: true },
    sub: '200+ AI models. Private access. Confidential compute.',
    cta: 'Meet HeyOpen',
    line: ['Private by architecture.', 'Open by choice.'],
  },
  privacy: {
    label: 'Built for Privacy',
    h: { a: 'Privacy isn’t optional.', b: 'It’s built into the architecture.', br: true },
    sub: 'Private AI goes beyond hiding conversations. OpenLedger combines anonymous routing, zero retention, and confidential computing to protect sensitive data throughout every request.',
    items: [
      { title: 'Anonymous Routing', body: 'Keep your identity separate from AI requests. Supported providers receive your prompt, not your account details.' },
      { title: 'Zero Retention', body: 'No stored prompts. No training on your conversations. Supported routes process requests without retaining your data.' },
      { title: 'Trusted Execution Environments (TEE)', body: 'Hardware-isolated enclaves protect sensitive requests during processing, reducing exposure to infrastructure operators.' },
      { title: 'End-to-End Encryption (E2EE)', body: 'Encrypt requests on your device and decrypt them only within verified execution environments on supported routes.' },
    ],
  },
  platform: {
    label: 'Private AI Capabilities',
    h: { a: 'More AI capabilities.', b: 'Privacy at the core.', br: true },
    sub: 'Access leading AI models, carry your context across conversations, and run autonomous agents through one privacy-focused experience.',
    cards: [
      { visual: 'models', title: 'Private Multi-Model Access', body: 'Access 200+ AI models through one platform, with privacy-focused routing and no provider lock-in.' },
      { visual: 'memory', title: 'Universal Memory', body: 'Switch models without losing context. Control what gets remembered and shared.' },
      { visual: 'context', title: 'Private Context', body: 'Keep personal knowledge and conversation history under your control, separate from provider-side retention.' },
      { visual: 'tokens', title: 'Token Optimized', body: 'Match each task to the right model and optimize token usage across requests.' },
      { visual: 'uncensored', title: 'Private, Uncensored AI', body: 'Access uncensored models through supported private routes, without additional platform-level filtering.' },
      { visual: 'agents', title: 'Agents + x402', body: 'Connect AI agents to tools and services, with controlled access to context and support for automated x402 payments.' },
    ],
  },
  heyopen: {
    label: 'OPEN in Action',
    h: { a: 'Meet HeyOpen.', b: 'Private AI, without limits.', br: true },
    lead: [
      '200+ AI models. One Universal Memory. Private conversations. Uncensored access.',
      'Everything comes together in HeyOpen, powered by OpenLedger and built to keep your data under your control.',
    ],
    cta: 'Meet HeyOpen',
    open: {
      h: { a: 'Powered by', b: 'OPEN.' },
      body: 'OPEN connects private model access, Universal Memory, agent capabilities, and x402-powered transactions.',
    },
  },
  ecosystem: {
    label: 'The OpenLedger Ecosystem',
    h: { a: 'The future of private AI', b: 'is wide open.', br: true },
    sub: 'An expanding ecosystem of partners advancing AI, privacy technology, and emerging infrastructure.',
  },
  protocol: {
    label: 'The OpenLedger Foundation',
    h: { a: 'Built for private AI.', b: 'Ready for what’s next.', br: true },
    sub: 'OpenLedger combines privacy-focused AI access with open standards, verifiable contributions, and programmable infrastructure.',
    items: [
      { title: 'AI-Native Infrastructure', body: 'Built to support AI models, applications, and autonomous agents.' },
      { title: 'EVM Compatibility', body: 'Ethereum-compatible architecture for applications, wallets, and smart contracts.' },
      { title: 'Proof of Attribution', body: 'Track and verify contributions across AI datasets, models, and applications.' },
      { title: 'Programmable Access', body: 'Connect AI services and agent workflows through APIs and x402-enabled transactions.' },
    ],
  },
  investors: {
    label: 'Backed & Supported',
    h: { a: 'Backing the future', b: 'of private AI.', br: true },
    sub: 'Supported by leading investors and industry figures across AI, blockchain, and technology.',
  },
  cta: {
    eyebrow: 'Experience Private AI',
    h: { a: 'More freedom.', b: 'Privacy built in.', br: true },
    sub: '200+ AI models. Private access. Uncensored options.',
    cta: 'Meet HeyOpen',
  },
};

export const VERSIONS = { 1: v1, 2: v2, 3: v3 };

// Page sections that can each take their own variation, in page order.
export const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'platform', label: 'Models' },
  { key: 'heyopen', label: 'HeyOpen' },
  { key: 'ecosystem', label: 'Ecosystem' },
  { key: 'protocol', label: 'Infrastructure' },
  { key: 'investors', label: 'Backers' },
  { key: 'cta', label: 'Closing' },
];
export const VERSION_IDS = Object.keys(VERSIONS);
export const DEFAULT_VERSION = VERSION_IDS[0];
