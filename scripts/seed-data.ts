import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const AI_ENGINES = ['chatgpt', 'gemini', 'claude', 'perplexity', 'google_aio'] as const
const SENTIMENTS = ['positive', 'neutral', 'negative'] as const

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample keywords for different categories
const SAMPLE_KEYWORDS = [
  { keyword: 'best project management software', category: 'Product' },
  { keyword: 'agile project management tools', category: 'Product' },
  { keyword: 'team collaboration software', category: 'Product' },
  { keyword: 'how to manage remote teams', category: 'Educational' },
  { keyword: 'project planning best practices', category: 'Educational' },
  { keyword: 'scrum vs kanban methodology', category: 'Educational' },
  { keyword: 'project management certification', category: 'Professional' },
  { keyword: 'pmp certification requirements', category: 'Professional' },
  { keyword: 'project manager salary', category: 'Career' },
  { keyword: 'asana vs monday.com comparison', category: 'Comparison' },
  { keyword: 'jira alternatives for small teams', category: 'Comparison' },
  { keyword: 'free project management tools', category: 'Budget' },
  { keyword: 'enterprise project portfolio management', category: 'Enterprise' },
  { keyword: 'construction project management software', category: 'Industry' },
  { keyword: 'IT project management framework', category: 'Industry' },
  { keyword: 'marketing project management tips', category: 'Industry' },
  { keyword: 'project tracking software', category: 'Product' },
  { keyword: 'gantt chart software online', category: 'Product' },
  { keyword: 'resource allocation tools', category: 'Product' },
  { keyword: 'project management KPIs', category: 'Analytics' },
]

function generateVisibilityPattern(dayIndex: number, engine: string, keyword: string) {
  const isWeekend = dayIndex % 7 === 5 || dayIndex % 7 === 6
  const categoryBonus = keyword.includes('best') || keyword.includes('software') ? 0.15 : 0
  
  const engineBonus = {
    'perplexity': 0.20,
    'chatgpt': 0.15,
    'claude': 0.10,
    'gemini': 0.10,
    'google_aio': 0.05,
  }[engine] || 0
  
  const trendBonus = (14 - dayIndex) * 0.005
  
  let basePresence = 0.30 + categoryBonus + engineBonus + trendBonus
  
  if (isWeekend) {
    basePresence *= 0.85
  }
  
  basePresence += (Math.random() - 0.5) * 0.15
  basePresence = Math.max(0.1, Math.min(0.85, basePresence))
  
  const presence = Math.random() < basePresence
  
  return {
    presence,
    position: presence ? Math.floor(Math.random() * 5) + 1 : null,
    citations_count: presence ? Math.floor(Math.random() * 4) : 0,
    sentiment: presence ? SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)] : null,
  }
}

function generateSnippet(keyword: string, brandName: string, engine: string) {
  const snippets = [
    `${brandName} is mentioned as a leading solution for ${keyword} with comprehensive features.`,
    `When considering ${keyword}, ${brandName} stands out for its intuitive interface and robust capabilities.`,
    `According to recent data, ${brandName} is frequently recommended for ${keyword} use cases.`,
    `${brandName} offers competitive advantages in the ${keyword} space, particularly for enterprise users.`,
    `For ${keyword}, ${brandName} provides a balanced approach between functionality and ease of use.`,
    `Industry experts highlight ${brandName} as a top choice when evaluating ${keyword} options.`,
    `${brandName}'s approach to ${keyword} has been well-received by both small teams and large organizations.`,
  ]
  
  return snippets[Math.floor(Math.random() * snippets.length)]
}

function generateUrls(domain: string, count: number) {
  const paths = [
    '/features', '/pricing', '/blog/guide', '/case-studies', 
    '/documentation', '/resources', '/comparison', '/reviews'
  ]
  
  return Array.from({ length: count }, () => 
    `https://${domain}${paths[Math.floor(Math.random() * paths.length)]}`
  )
}

async function seedProject(tenantId: string, projectData: {
  name: string
  domain: string
  brand_name: string
  competitors: string[]
}) {
  console.log(`\n📦 Creating project: ${projectData.name}`)
  
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      tenant_id: tenantId,
      ...projectData,
    })
    .select()
    .single()
  
  if (projectError) {
    console.error('Error creating project:', projectError)
    return
  }
  
  console.log(`✅ Project created: ${project.id}`)
  
  console.log(`📝 Adding ${SAMPLE_KEYWORDS.length} keywords...`)
  const keywordsToInsert = SAMPLE_KEYWORDS.map(k => ({
    project_id: project.id,
    keyword: k.keyword,
    category: k.category,
    priority: Math.floor(Math.random() * 3) + 1,
  }))
  
  const { data: keywords, error: keywordsError } = await supabase
    .from('keywords')
    .insert(keywordsToInsert)
    .select()
  
  if (keywordsError) {
    console.error('Error creating keywords:', keywordsError)
    return
  }
  
  console.log(`✅ ${keywords.length} keywords added`)
  console.log(`📊 Generating 14 days of visibility checks...`)
  
  let totalChecks = 0
  
  for (let day = 14; day >= 0; day--) {
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - day)
    timestamp.setHours(9, 0, 0, 0)
    
    const checks = []
    
    for (const keyword of keywords) {
      for (const engine of AI_ENGINES) {
        const pattern = generateVisibilityPattern(day, engine, keyword.keyword)
        
        checks.push({
          keyword_id: keyword.id,
          engine,
          presence: pattern.presence,
          position: pattern.position,
          citations_count: pattern.citations_count,
          answer_snippet: pattern.presence 
            ? generateSnippet(keyword.keyword, projectData.brand_name, engine)
            : null,
          observed_urls: pattern.presence 
            ? generateUrls(projectData.domain, Math.floor(Math.random() * 3) + 1)
            : [],
          sentiment: pattern.sentiment,
          timestamp: timestamp.toISOString(),
        })
      }
    }
    
    for (let i = 0; i < checks.length; i += 100) {
      const batch = checks.slice(i, i + 100)
      const { error: checksError } = await supabase
        .from('visibility_checks')
        .insert(batch)
      
      if (checksError) {
        console.error(`Error inserting checks batch ${i}:`, checksError)
      } else {
        totalChecks += batch.length
      }
    }
    
    console.log(`  Day ${14 - day + 1}/15: ${checks.length} checks`)
  }
  
  console.log(`✅ Total ${totalChecks} visibility checks created`)
  return project.id
}

async function main() {
  console.log('🌱 Starting seed process...\n')
  
  const { data: tenants, error: tenantsError } = await supabase
    .from('tenants')
    .select('*')
    .limit(1)
  
  if (tenantsError || !tenants || tenants.length === 0) {
    console.error('❌ No tenants found. Please sign up first at http://localhost:3000/signup')
    return
  }
  
  const tenant = tenants[0]
  console.log(`🏢 Using tenant: ${tenant.name} (${tenant.id})`)
  
  await seedProject(tenant.id, {
    name: 'Demo Project - Q4 2025',
    domain: 'acmeprojects.com',
    brand_name: 'Acme Projects',
    competitors: ['CompetitorA', 'CompetitorB', 'CompetitorC'],
  })
  
  console.log('\n✨ Seed completed successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
