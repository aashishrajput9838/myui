import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Search, 
  Grid, 
  Image as ImageIcon, 
  FolderHeart,
  Globe,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-7xl">
                Save and Organize Your <span className="text-primary">Favorite Website</span> Inspirations
              </h1>
              <p className="mb-10 text-xl text-muted-foreground">
                Build your personal library of beautiful websites, UI patterns, and design inspirations. 
                Automatically generate screenshots and organize them effortlessly.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-lg" asChild>
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  Explore Gallery
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background Gradient */}
          <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        </section>

        {/* Features Section */}
        <section id="features" className="bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Everything you need to stay inspired</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                MyUI provides all the tools you need to capture, organize, and revisit the websites that inspire your next project.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={<ImageIcon className="h-6 w-6" />}
                title="Auto Screenshots"
                description="Just paste a URL and we'll automatically generate a high-quality screenshot for you."
              />
              <FeatureCard 
                icon={<Grid className="h-6 w-6" />}
                title="Smart Collections"
                description="Organize your inspirations into collections like 'Landing Pages', 'SaaS', or 'Dashboards'."
              />
              <FeatureCard 
                icon={<Search className="h-6 w-6" />}
                title="Global Search"
                description="Find exactly what you're looking for with real-time search across all your saved websites."
              />
              <FeatureCard 
                icon={<FolderHeart className="h-6 w-6" />}
                title="Favorites"
                description="Mark your most loved designs as favorites for quick and easy access."
              />
              <FeatureCard 
                icon={<Globe className="h-6 w-6" />}
                title="Meta Discovery"
                description="Automatically fetch site titles, descriptions, and favicons to keep your library rich with data."
              />
              <FeatureCard 
                icon={<Zap className="h-6 w-6" />}
                title="Lightning Fast"
                description="Built for speed and performance, so you can focus on being inspired, not waiting."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-3xl font-bold lg:text-4xl">How It Works</h2>
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Paste URL</h3>
                <p className="text-muted-foreground">Copy the URL of any website you find inspiring and paste it into MyUI.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Auto-Generate</h3>
                <p className="text-muted-foreground">We automatically capture a full-page screenshot and extract site metadata.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Organize</h3>
                <p className="text-muted-foreground">Save it to a collection and tag it for easy retrieval later.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-3xl font-bold lg:text-4xl">Loved by designers worldwide</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <TestimonialCard 
                quote="MyUI has completely changed how I collect inspiration. It's so much faster than taking manual screenshots."
                author="Sarah Jenkins"
                role="Senior UI Designer"
              />
              <TestimonialCard 
                quote="The auto-screenshot feature is a game changer. I love how it keeps my inspiration library so organized."
                author="Michael Chen"
                role="Product Designer"
              />
              <TestimonialCard 
                quote="Clean, minimal, and does exactly what it says. It's become an essential part of my design workflow."
                author="Elena Rodriguez"
                role="Freelance Developer"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="mb-16 text-center text-3xl font-bold lg:text-4xl">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <FAQItem 
                question="How many websites can I save?"
                answer="The free plan allows you to save up to 50 websites. Our Pro plan offers unlimited storage."
              />
              <FAQItem 
                question="Can I export my collections?"
                answer="Yes, you can export your collections as a JSON file or a list of URLs at any time."
              />
              <FAQItem 
                question="Do you support full-page screenshots?"
                answer="Absolutely! MyUI captures the entire homepage so you can see the full layout and design patterns."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Ready to build your inspiration library?</h2>
              <p className="mb-10 text-xl text-muted-foreground">
                Join thousands of designers and developers who use MyUI to stay inspired.
              </p>
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/dashboard">
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-2xl border bg-background p-8 transition-all hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="rounded-2xl border bg-background p-8 italic shadow-sm">
      <p className="mb-6 text-muted-foreground">"{quote}"</p>
      <div>
        <p className="font-semibold not-italic">{author}</p>
        <p className="text-sm text-muted-foreground not-italic">{role}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="mb-2 font-semibold">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}
