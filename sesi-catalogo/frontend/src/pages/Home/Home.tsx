import { FeaturedCourses } from '../../sections/FeaturedCourses/FeaturedCourses'
import { HeroSection } from '../../sections/HeroSection/HeroSection'
import { ImpactSection } from '../../sections/ImpactSection/ImpactSection'
import { TestimonialsSection } from '../../sections/TestimonialsSection/TestimonialsSection'
import { CareerSection } from '../../sections/CareerSection/CareerSection'

export function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturedCourses />
      <ImpactSection />
      <TestimonialsSection />
      <CareerSection />
    </div>
  )
}
