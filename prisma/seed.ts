import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin User ─────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ratewise.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: hash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user: ${adminEmail}`);

  // ─── EU VAT Rates ──────────────────────────────────────────────────
  const vatRates = [
    { countryCode: 'AT', countryName: 'Austria', standardRate: 20, reducedRate: 10, source: 'EU Commission' },
    { countryCode: 'BE', countryName: 'Belgium', standardRate: 21, reducedRate: 6, source: 'EU Commission' },
    { countryCode: 'BG', countryName: 'Bulgaria', standardRate: 20, reducedRate: 9, source: 'EU Commission' },
    { countryCode: 'HR', countryName: 'Croatia', standardRate: 25, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'CY', countryName: 'Cyprus', standardRate: 19, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'CZ', countryName: 'Czech Republic', standardRate: 21, reducedRate: 12, source: 'EU Commission' },
    { countryCode: 'DK', countryName: 'Denmark', standardRate: 25, reducedRate: null, source: 'EU Commission' },
    { countryCode: 'EE', countryName: 'Estonia', standardRate: 22, reducedRate: 9, source: 'EU Commission' },
    { countryCode: 'FI', countryName: 'Finland', standardRate: 25.5, reducedRate: 14, source: 'EU Commission' },
    { countryCode: 'FR', countryName: 'France', standardRate: 20, reducedRate: 5.5, superReduced: 2.1, source: 'EU Commission' },
    { countryCode: 'DE', countryName: 'Germany', standardRate: 19, reducedRate: 7, source: 'EU Commission' },
    { countryCode: 'GR', countryName: 'Greece', standardRate: 24, reducedRate: 6, source: 'EU Commission' },
    { countryCode: 'HU', countryName: 'Hungary', standardRate: 27, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'IE', countryName: 'Ireland', standardRate: 23, reducedRate: 9, parkingRate: 13.5, source: 'EU Commission' },
    { countryCode: 'IT', countryName: 'Italy', standardRate: 22, reducedRate: 5, superReduced: 4, source: 'EU Commission' },
    { countryCode: 'LV', countryName: 'Latvia', standardRate: 21, reducedRate: 12, source: 'EU Commission' },
    { countryCode: 'LT', countryName: 'Lithuania', standardRate: 21, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'LU', countryName: 'Luxembourg', standardRate: 17, reducedRate: 8, superReduced: 3, parkingRate: 14, source: 'EU Commission' },
    { countryCode: 'MT', countryName: 'Malta', standardRate: 18, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'NL', countryName: 'Netherlands', standardRate: 21, reducedRate: 9, source: 'EU Commission' },
    { countryCode: 'PL', countryName: 'Poland', standardRate: 23, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'PT', countryName: 'Portugal', standardRate: 23, reducedRate: 6, parkingRate: 13, source: 'EU Commission' },
    { countryCode: 'RO', countryName: 'Romania', standardRate: 19, reducedRate: 5, source: 'EU Commission' },
    { countryCode: 'SK', countryName: 'Slovakia', standardRate: 23, reducedRate: 10, source: 'EU Commission' },
    { countryCode: 'SI', countryName: 'Slovenia', standardRate: 22, reducedRate: 9.5, source: 'EU Commission' },
    { countryCode: 'ES', countryName: 'Spain', standardRate: 21, reducedRate: 10, superReduced: 4, source: 'EU Commission' },
    { countryCode: 'SE', countryName: 'Sweden', standardRate: 25, reducedRate: 6, source: 'EU Commission' },
  ];

  for (const vat of vatRates) {
    await prisma.vatRate.upsert({
      where: { countryCode: vat.countryCode },
      update: { standardRate: vat.standardRate, reducedRate: vat.reducedRate },
      create: vat,
    });
  }
  console.log(`✅ ${vatRates.length} EU VAT rates seeded`);

  // ─── US Sales Tax Rates ─────────────────────────────────────────────
  const salesTaxRates = [
    { stateCode: 'AL', stateName: 'Alabama', stateRate: 4.0, avgLocalRate: 5.24, combinedRate: 9.24 },
    { stateCode: 'AK', stateName: 'Alaska', stateRate: 0.0, avgLocalRate: 1.76, combinedRate: 1.76 },
    { stateCode: 'AZ', stateName: 'Arizona', stateRate: 5.6, avgLocalRate: 2.80, combinedRate: 8.40 },
    { stateCode: 'AR', stateName: 'Arkansas', stateRate: 6.5, avgLocalRate: 2.97, combinedRate: 9.47 },
    { stateCode: 'CA', stateName: 'California', stateRate: 7.25, avgLocalRate: 1.57, combinedRate: 8.82 },
    { stateCode: 'CO', stateName: 'Colorado', stateRate: 2.9, avgLocalRate: 4.87, combinedRate: 7.77 },
    { stateCode: 'CT', stateName: 'Connecticut', stateRate: 6.35, avgLocalRate: 0.0, combinedRate: 6.35 },
    { stateCode: 'DE', stateName: 'Delaware', stateRate: 0.0, avgLocalRate: 0.0, combinedRate: 0.0 },
    { stateCode: 'FL', stateName: 'Florida', stateRate: 6.0, avgLocalRate: 1.05, combinedRate: 7.05 },
    { stateCode: 'GA', stateName: 'Georgia', stateRate: 4.0, avgLocalRate: 3.38, combinedRate: 7.38 },
    { stateCode: 'HI', stateName: 'Hawaii', stateRate: 4.0, avgLocalRate: 0.44, combinedRate: 4.44 },
    { stateCode: 'ID', stateName: 'Idaho', stateRate: 6.0, avgLocalRate: 0.02, combinedRate: 6.02 },
    { stateCode: 'IL', stateName: 'Illinois', stateRate: 6.25, avgLocalRate: 2.57, combinedRate: 8.82 },
    { stateCode: 'IN', stateName: 'Indiana', stateRate: 7.0, avgLocalRate: 0.0, combinedRate: 7.0 },
    { stateCode: 'IA', stateName: 'Iowa', stateRate: 6.0, avgLocalRate: 0.94, combinedRate: 6.94 },
    { stateCode: 'KS', stateName: 'Kansas', stateRate: 6.5, avgLocalRate: 2.20, combinedRate: 8.70 },
    { stateCode: 'KY', stateName: 'Kentucky', stateRate: 6.0, avgLocalRate: 0.0, combinedRate: 6.0 },
    { stateCode: 'LA', stateName: 'Louisiana', stateRate: 4.45, avgLocalRate: 5.10, combinedRate: 9.55 },
    { stateCode: 'ME', stateName: 'Maine', stateRate: 5.5, avgLocalRate: 0.0, combinedRate: 5.5 },
    { stateCode: 'MD', stateName: 'Maryland', stateRate: 6.0, avgLocalRate: 0.0, combinedRate: 6.0 },
    { stateCode: 'MA', stateName: 'Massachusetts', stateRate: 6.25, avgLocalRate: 0.0, combinedRate: 6.25 },
    { stateCode: 'MI', stateName: 'Michigan', stateRate: 6.0, avgLocalRate: 0.0, combinedRate: 6.0 },
    { stateCode: 'MN', stateName: 'Minnesota', stateRate: 6.875, avgLocalRate: 0.60, combinedRate: 7.475 },
    { stateCode: 'MS', stateName: 'Mississippi', stateRate: 7.0, avgLocalRate: 0.07, combinedRate: 7.07 },
    { stateCode: 'MO', stateName: 'Missouri', stateRate: 4.225, avgLocalRate: 4.06, combinedRate: 8.285 },
    { stateCode: 'MT', stateName: 'Montana', stateRate: 0.0, avgLocalRate: 0.0, combinedRate: 0.0 },
    { stateCode: 'NE', stateName: 'Nebraska', stateRate: 5.5, avgLocalRate: 1.44, combinedRate: 6.94 },
    { stateCode: 'NV', stateName: 'Nevada', stateRate: 6.85, avgLocalRate: 1.38, combinedRate: 8.23 },
    { stateCode: 'NH', stateName: 'New Hampshire', stateRate: 0.0, avgLocalRate: 0.0, combinedRate: 0.0 },
    { stateCode: 'NJ', stateName: 'New Jersey', stateRate: 6.625, avgLocalRate: -0.03, combinedRate: 6.60 },
    { stateCode: 'NM', stateName: 'New Mexico', stateRate: 4.875, avgLocalRate: 2.69, combinedRate: 7.565 },
    { stateCode: 'NY', stateName: 'New York', stateRate: 4.0, avgLocalRate: 4.52, combinedRate: 8.52 },
    { stateCode: 'NC', stateName: 'North Carolina', stateRate: 4.75, avgLocalRate: 2.23, combinedRate: 6.98 },
    { stateCode: 'ND', stateName: 'North Dakota', stateRate: 5.0, avgLocalRate: 1.96, combinedRate: 6.96 },
    { stateCode: 'OH', stateName: 'Ohio', stateRate: 5.75, avgLocalRate: 1.48, combinedRate: 7.23 },
    { stateCode: 'OK', stateName: 'Oklahoma', stateRate: 4.5, avgLocalRate: 4.47, combinedRate: 8.97 },
    { stateCode: 'OR', stateName: 'Oregon', stateRate: 0.0, avgLocalRate: 0.0, combinedRate: 0.0 },
    { stateCode: 'PA', stateName: 'Pennsylvania', stateRate: 6.0, avgLocalRate: 0.34, combinedRate: 6.34 },
    { stateCode: 'RI', stateName: 'Rhode Island', stateRate: 7.0, avgLocalRate: 0.0, combinedRate: 7.0 },
    { stateCode: 'SC', stateName: 'South Carolina', stateRate: 6.0, avgLocalRate: 1.43, combinedRate: 7.43 },
    { stateCode: 'SD', stateName: 'South Dakota', stateRate: 4.2, avgLocalRate: 1.90, combinedRate: 6.10 },
    { stateCode: 'TN', stateName: 'Tennessee', stateRate: 7.0, avgLocalRate: 2.55, combinedRate: 9.55 },
    { stateCode: 'TX', stateName: 'Texas', stateRate: 6.25, avgLocalRate: 1.94, combinedRate: 8.19 },
    { stateCode: 'UT', stateName: 'Utah', stateRate: 6.1, avgLocalRate: 1.09, combinedRate: 7.19 },
    { stateCode: 'VT', stateName: 'Vermont', stateRate: 6.0, avgLocalRate: 0.24, combinedRate: 6.24 },
    { stateCode: 'VA', stateName: 'Virginia', stateRate: 5.3, avgLocalRate: 0.45, combinedRate: 5.75 },
    { stateCode: 'WA', stateName: 'Washington', stateRate: 6.5, avgLocalRate: 2.67, combinedRate: 9.17 },
    { stateCode: 'WV', stateName: 'West Virginia', stateRate: 6.0, avgLocalRate: 0.39, combinedRate: 6.39 },
    { stateCode: 'WI', stateName: 'Wisconsin', stateRate: 5.0, avgLocalRate: 0.44, combinedRate: 5.44 },
    { stateCode: 'WY', stateName: 'Wyoming', stateRate: 4.0, avgLocalRate: 1.36, combinedRate: 5.36 },
    { stateCode: 'DC', stateName: 'District of Columbia', stateRate: 6.0, avgLocalRate: 0.0, combinedRate: 6.0 },
  ];

  for (const tax of salesTaxRates) {
    await prisma.salesTaxRate.upsert({
      where: { stateCode: tax.stateCode },
      update: { stateRate: tax.stateRate },
      create: { ...tax, source: 'Tax Foundation' },
    });
  }
  console.log(`✅ ${salesTaxRates.length} US sales tax rates seeded`);

  // ─── Site Settings ──────────────────────────────────────────────────
  const settings = [
    { key: 'siteName', value: 'RateWise' },
    { key: 'logoUrl', value: '/logo.svg' },
    { key: 'primaryColor', value: '#2563eb' },
    { key: 'footerText', value: '© 2026 RateWise. All rights reserved.' },
    { key: 'adTopBanner', value: 'true' },
    { key: 'adSidebar', value: 'true' },
    { key: 'adInContent', value: 'true' },
    { key: 'adFooter', value: 'true' },
    { key: 'ga4Id', value: '' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Site settings seeded');

  // ─── Salary Configs ─────────────────────────────────────────────────
  const salaryConfigs = [
    {
      countryCode: 'US',
      countryName: 'United States',
      config: JSON.stringify({
        currency: 'USD',
        brackets: [
          { min: 0, max: 11600, rate: 10 },
          { min: 11600, max: 47150, rate: 12 },
          { min: 47150, max: 100525, rate: 22 },
          { min: 100525, max: 191950, rate: 24 },
          { min: 191950, max: 243725, rate: 32 },
          { min: 243725, max: 609350, rate: 35 },
          { min: 609350, max: Infinity, rate: 37 },
        ],
        standardDeduction: 14600,
        socialSecurity: { rate: 6.2, cap: 168600 },
        medicare: { rate: 1.45, additionalRate: 0.9, threshold: 200000 },
        filingStatuses: ['single', 'married_jointly', 'married_separately', 'head_of_household'],
      }),
    },
    {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      config: JSON.stringify({
        currency: 'GBP',
        brackets: [
          { min: 0, max: 12570, rate: 0 },
          { min: 12570, max: 50270, rate: 20 },
          { min: 50270, max: 125140, rate: 40 },
          { min: 125140, max: Infinity, rate: 45 },
        ],
        nationalInsurance: { rate: 8, threshold: 12570, upperLimit: 50270, upperRate: 2 },
      }),
    },
    {
      countryCode: 'DE',
      countryName: 'Germany',
      config: JSON.stringify({
        currency: 'EUR',
        brackets: [
          { min: 0, max: 11604, rate: 0 },
          { min: 11604, max: 17005, rate: 14 },
          { min: 17005, max: 66760, rate: 24 },
          { min: 66760, max: 277825, rate: 42 },
          { min: 277825, max: Infinity, rate: 45 },
        ],
        socialContributions: { pension: 9.3, health: 7.3, unemployment: 1.3, care: 1.7 },
        solidaritySurcharge: 5.5,
      }),
    },
    {
      countryCode: 'FR',
      countryName: 'France',
      config: JSON.stringify({
        currency: 'EUR',
        brackets: [
          { min: 0, max: 11294, rate: 0 },
          { min: 11294, max: 28797, rate: 11 },
          { min: 28797, max: 82341, rate: 30 },
          { min: 82341, max: 177106, rate: 41 },
          { min: 177106, max: Infinity, rate: 45 },
        ],
        socialContributions: { totalRate: 22.0 },
      }),
    },
    {
      countryCode: 'NL',
      countryName: 'Netherlands',
      config: JSON.stringify({
        currency: 'EUR',
        brackets: [
          { min: 0, max: 38098, rate: 9.32 },
          { min: 38098, max: 75518, rate: 36.97 },
          { min: 75518, max: Infinity, rate: 49.5 },
        ],
        socialContributions: { totalRate: 27.65, cap: 38098 },
      }),
    },
  ];

  for (const sc of salaryConfigs) {
    await prisma.salaryConfig.upsert({
      where: { countryCode: sc.countryCode },
      update: { config: sc.config },
      create: sc,
    });
  }
  console.log('✅ Salary configs seeded');

  // ─── Landing Pages with FAQs ───────────────────────────────────────
  // VAT landing pages
  for (const vat of vatRates) {
    const countrySlug = vat.countryName.toLowerCase().replace(/\s+/g, '-');
    const slug = `vat/${countrySlug}`;
    const page = await prisma.landingPage.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        section: 'vat',
        title: `${vat.countryName} VAT Calculator – Calculate VAT at ${vat.standardRate}%`,
        metaDescription: `Free ${vat.countryName} VAT calculator. Quickly calculate VAT at the standard rate of ${vat.standardRate}%. Add or remove VAT from any amount. Updated for 2026.`,
        h1: `${vat.countryName} VAT Calculator`,
        introParagraph: `Calculate Value Added Tax (VAT) for ${vat.countryName} with our free online calculator. The standard VAT rate in ${vat.countryName} is ${vat.standardRate}%. Simply enter an amount to add or remove VAT instantly. Our calculator supports both VAT-inclusive and VAT-exclusive calculations, making it easy for businesses and consumers alike to determine the correct tax amount.`,
        howItWorks: `**How the ${vat.countryName} VAT Calculator Works**\n\n1. Select whether you want to add or remove VAT\n2. Enter the amount in the input field\n3. The default VAT rate (${vat.standardRate}%) is pre-filled, but you can override it\n4. Click "Calculate" to see the net amount, VAT amount, and gross total\n5. Copy or share results as needed`,
        examples: `**Example Calculation**\n\nIf you have a net amount of €1,000 and need to add ${vat.standardRate}% VAT:\n- Net amount: €1,000.00\n- VAT (${vat.standardRate}%): €${(1000 * vat.standardRate / 100).toFixed(2)}\n- Gross amount: €${(1000 * (1 + vat.standardRate / 100)).toFixed(2)}`,
        commonMistakes: `**Common Mistakes**\n\n- Confusing VAT-inclusive and VAT-exclusive amounts\n- Using the wrong VAT rate (standard vs. reduced)\n- Not accounting for exemptions on certain goods/services\n- Mixing up net and gross figures on invoices`,
      },
    });

    const faqs = [
      { question: `What is the standard VAT rate in ${vat.countryName}?`, answer: `The standard VAT rate in ${vat.countryName} is ${vat.standardRate}%. ${vat.reducedRate ? `There is also a reduced rate of ${vat.reducedRate}% that applies to certain goods and services.` : ''}` },
      { question: `How do I calculate VAT in ${vat.countryName}?`, answer: `To add VAT: multiply the net amount by ${vat.standardRate / 100}. To remove VAT from a gross amount: divide by ${(1 + vat.standardRate / 100).toFixed(4)} to get the net amount, then subtract to find the VAT.` },
      { question: `What goods have reduced VAT rates in ${vat.countryName}?`, answer: `Reduced VAT rates typically apply to essential goods such as food, books, medicines, and public transport. The specific items vary by country. Check your national tax authority for the complete list.` },
      { question: `Do I need to charge VAT on exports from ${vat.countryName}?`, answer: `Exports from ${vat.countryName} to countries outside the EU are generally zero-rated (0% VAT). Intra-EU supplies may be zero-rated if the buyer provides a valid VAT number.` },
      { question: `How often do VAT rates change in ${vat.countryName}?`, answer: `VAT rates in ${vat.countryName} can change through national legislation. Changes are typically announced ahead of time. Our calculator is regularly updated to reflect the latest rates.` },
      { question: `Can I reclaim VAT paid in ${vat.countryName}?`, answer: `If you are a VAT-registered business, you can typically reclaim VAT on business purchases through your VAT return. The process varies by country. Consult your local tax authority for specific rules.` },
    ];

    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: { ...faqs[i], sortOrder: i, landingPageId: page.id },
      });
    }
  }
  console.log('✅ VAT landing pages with FAQs seeded');

  // Sales tax landing pages (sample for top 10 states)
  const topStates = salesTaxRates.filter(s =>
    ['CA', 'TX', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'WA'].includes(s.stateCode),
  );

  for (const st of topStates) {
    const stateSlug = st.stateName.toLowerCase().replace(/\s+/g, '-');
    const slug = `sales-tax/${stateSlug}`;
    const page = await prisma.landingPage.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        section: 'sales-tax',
        title: `${st.stateName} Sales Tax Calculator – ${st.combinedRate}% Rate`,
        metaDescription: `Calculate ${st.stateName} sales tax. State rate: ${st.stateRate}%, average combined rate: ${st.combinedRate}%. Free, fast, and accurate.`,
        h1: `${st.stateName} Sales Tax Calculator`,
        introParagraph: `Use our free ${st.stateName} sales tax calculator to determine the exact sales tax on any purchase. The ${st.stateName} state sales tax rate is ${st.stateRate}%, with an average combined rate of ${st.combinedRate}% when local taxes are included. Whether you're a business owner or a consumer, our tool helps you calculate the precise tax amount in seconds.`,
        howItWorks: `**How to Calculate ${st.stateName} Sales Tax**\n\n1. Enter the purchase amount\n2. The state rate (${st.stateRate}%) is pre-filled\n3. Optionally enter a local tax rate\n4. Click "Calculate" to see the tax amount and total\n5. Copy your results`,
        examples: `**Example**\n\nFor a $100 purchase in ${st.stateName}:\n- Subtotal: $100.00\n- State tax (${st.stateRate}%): $${(100 * st.stateRate / 100).toFixed(2)}\n- Estimated total with avg local tax: $${(100 * (1 + (st.combinedRate || st.stateRate) / 100)).toFixed(2)}`,
        commonMistakes: `**Common Mistakes**\n\n- Forgetting to include local/county sales tax\n- Not knowing certain items may be exempt\n- Applying tax to non-taxable services\n- Not updating rates when they change`,
      },
    });

    const faqs = [
      { question: `What is the sales tax rate in ${st.stateName}?`, answer: `The ${st.stateName} state sales tax rate is ${st.stateRate}%. With average local taxes, the combined rate is approximately ${st.combinedRate}%.` },
      { question: `Does ${st.stateName} tax groceries?`, answer: `Grocery taxation varies by state and locality. In many states, unprepared food is exempt from sales tax. Check ${st.stateName}'s specific rules with the state department of revenue.` },
      { question: `How do I calculate sales tax?`, answer: `Multiply the purchase price by the tax rate (as a decimal). For example, $100 × 0.${String(st.stateRate).replace('.', '')} = $${(100 * st.stateRate / 100).toFixed(2)} in state tax.` },
      { question: `Are online purchases subject to ${st.stateName} sales tax?`, answer: `Yes, since the 2018 South Dakota v. Wayfair Supreme Court decision, most online retailers collect sales tax in states where they have economic nexus, including ${st.stateName}.` },
      { question: `What items are exempt from sales tax in ${st.stateName}?`, answer: `Common exemptions may include prescription medications, certain food items, and some clothing. The specific exemptions vary by state.` },
      { question: `How often does the sales tax rate change in ${st.stateName}?`, answer: `State rates change through legislative action. Local rates can change more frequently. Our calculator is regularly updated with the latest rates.` },
    ];

    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: { ...faqs[i], sortOrder: i, landingPageId: page.id },
      });
    }
  }
  console.log('✅ Sales tax landing pages with FAQs seeded');

  // Salary landing pages
  for (const sc of salaryConfigs) {
    const countrySlug = sc.countryName.toLowerCase().replace(/\s+/g, '-');
    const slug = `salary/${countrySlug}`;
    const config = JSON.parse(sc.config);
    const page = await prisma.landingPage.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        section: 'salary',
        title: `${sc.countryName} Salary Calculator – Gross to Net Pay`,
        metaDescription: `Free ${sc.countryName} salary calculator. Calculate your take-home pay from gross salary. Includes tax brackets, social contributions, and deductions. Updated for 2026.`,
        h1: `${sc.countryName} Take-Home Pay Calculator`,
        introParagraph: `Calculate your estimated net salary in ${sc.countryName} with our free take-home pay calculator. Enter your gross annual salary to see a detailed breakdown of income tax, social contributions, and your estimated net pay. Our calculator uses the latest ${sc.countryName} tax brackets and rates. Results are estimates — consult a tax professional for precise figures.`,
        howItWorks: `**How It Works**\n\n1. Enter your gross annual salary in ${config.currency}\n2. Select your pay frequency (monthly, bi-weekly, weekly)\n3. Adjust optional deductions like pension contributions\n4. Click "Calculate" to see your estimated take-home pay\n5. View the detailed breakdown of taxes and contributions`,
        examples: `**Example**\n\nFor a gross annual salary of ${config.currency} 50,000 in ${sc.countryName}, your estimated take-home pay will vary based on applicable tax brackets, standard deductions, and social contributions. Use our calculator above for a personalized result.`,
        commonMistakes: `**Common Mistakes**\n\n- Not accounting for all social contributions\n- Forgetting employer vs. employee tax responsibilities\n- Using outdated tax brackets\n- Not considering regional or municipal taxes where applicable`,
      },
    });

    const faqs = [
      { question: `How is income tax calculated in ${sc.countryName}?`, answer: `${sc.countryName} uses a progressive tax system with multiple brackets. Your income is taxed at increasing rates as it passes through each bracket threshold.` },
      { question: `What deductions reduce my taxable income in ${sc.countryName}?`, answer: `Common deductions include standard/personal allowances, pension contributions, charitable donations, and certain work-related expenses. The specifics depend on ${sc.countryName}'s tax code.` },
      { question: `How often should I review my salary calculation?`, answer: `Review annually, especially after tax year changes, salary increases, or changes in personal circumstances (marriage, children, etc.).` },
      { question: `Is this calculator accurate for ${sc.countryName}?`, answer: `Our calculator provides estimates based on standard tax rates and deductions. Individual circumstances may vary. Always consult a qualified tax advisor for precise calculations.` },
      { question: `What social contributions apply in ${sc.countryName}?`, answer: `Social contributions typically cover pension, health insurance, unemployment insurance, and sometimes additional items. Both employees and employers contribute, though rates differ by country.` },
      { question: `Does this calculator account for bonuses?`, answer: `You can include a bonus amount in the calculator. Note that bonuses may be taxed differently (e.g., at a flat rate or aggregated with regular income) depending on the country.` },
    ];

    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: { ...faqs[i], sortOrder: i, landingPageId: page.id },
      });
    }
  }
  console.log('✅ Salary landing pages with FAQs seeded');

  // Finance landing pages
  const financePages = [
    {
      slug: 'finance/compound-interest',
      title: 'Compound Interest Calculator – Calculate Investment Growth',
      metaDescription: 'Free compound interest calculator. See how your investments grow over time with compounding. Includes year-by-year breakdown and charts.',
      h1: 'Compound Interest Calculator',
      introParagraph: 'Calculate how your money grows with compound interest using our free calculator. Enter your initial investment, monthly contributions, interest rate, and time horizon to see a detailed projection of your wealth accumulation. Understand the power of compounding and make informed investment decisions.',
    },
    {
      slug: 'finance/loan-calculator',
      title: 'Loan & Mortgage Calculator – Amortization Schedule',
      metaDescription: 'Free loan and mortgage calculator with amortization schedule. Calculate monthly payments, total interest, and see a detailed payment breakdown.',
      h1: 'Loan & Mortgage Amortization Calculator',
      introParagraph: 'Calculate your monthly loan or mortgage payments with our free amortization calculator. Enter the loan amount, interest rate, and term to see your payment schedule. Includes total interest paid and the option to add extra payments to see how much you can save.',
    },
    {
      slug: 'finance/fire',
      title: 'FIRE Calculator – Financial Independence Retire Early',
      metaDescription: 'Free FIRE calculator. Calculate your Financial Independence number, years to FIRE, and see projections based on your savings rate and investment returns.',
      h1: 'FIRE Number Calculator',
      introParagraph: 'Calculate your Financial Independence, Retire Early (FIRE) number with our free calculator. Based on the 4% rule and your annual expenses, determine how much you need to save to achieve financial independence. See projections for how long it will take based on your current savings and investment returns.',
    },
  ];

  for (const fp of financePages) {
    const page = await prisma.landingPage.upsert({
      where: { slug: fp.slug },
      update: {},
      create: {
        ...fp,
        section: 'finance',
        howItWorks: '**How It Works**\n\n1. Enter your values in the input fields\n2. Adjust optional parameters\n3. Click "Calculate" to see results\n4. Review the detailed breakdown\n5. Share or save your results',
        examples: 'Use the calculator above with your own numbers for a personalized result.',
        commonMistakes: '**Common Mistakes**\n\n- Using nominal vs. real returns\n- Not accounting for inflation\n- Overlooking fees and taxes on investments\n- Being overly optimistic about return rates',
      },
    });

    const faqs = [
      { question: 'How accurate is this calculator?', answer: 'This calculator provides estimates based on the inputs you provide. Actual results may vary due to market conditions, tax considerations, and other factors.' },
      { question: 'Should I account for inflation?', answer: 'Yes, when planning long-term, consider using real (inflation-adjusted) returns rather than nominal returns. A common assumption is 2-3% annual inflation.' },
      { question: 'What interest rate should I use?', answer: 'For stock market investments, a common long-term average is 7-10% nominal (4-7% real). For bonds, 3-5%. For savings accounts, check your current APY.' },
      { question: 'How does compounding frequency affect results?', answer: 'More frequent compounding (daily vs. monthly vs. annually) yields slightly higher returns, though the difference diminishes at higher frequencies.' },
      { question: 'Can I include tax considerations?', answer: 'This calculator provides pre-tax estimates. For after-tax projections, consider your marginal tax rate on investment gains and dividends.' },
      { question: 'What is the 4% rule?', answer: 'The 4% rule suggests you can safely withdraw 4% of your portfolio annually in retirement without running out of money over a 30-year period. This is based on historical stock/bond returns.' },
    ];

    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: { ...faqs[i], sortOrder: i, landingPageId: page.id },
      });
    }
  }
  console.log('✅ Finance landing pages with FAQs seeded');

  console.log('\n🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
