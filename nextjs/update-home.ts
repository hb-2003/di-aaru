import "reflect-metadata";
import { AppDataSource, initializeDatabase } from './src/lib/db/config';
import { Page, PageSection } from './src/lib/db/models';

const homePageData = {
    title: "Home",
    slug: "home",
    seoTitle: "Di'aaru - Luxury Lab-Grown Diamonds | Ethical & Sustainable Fine Jewelry",
    seoDescription: "Discover Di'aaru's exquisite collection of lab-grown diamonds. Ethically crafted, environmentally sustainable, and brilliantly beautiful. Each piece tells a story of timeless elegance and modern responsibility.",
    sections: [
        {
            __component: "shared.hero-section",
            heading: "Timeless Brilliance",
            sub_heading: "LUXURY LAB-GROWN DIAMONDS",
            description: "<p>Ethically crafted, infinitely beautiful. Discover diamonds that reflect not just light, but your values.</p>",
            button_text: "Explore Our Collection",
            button_link: "#products",
            background_image: { url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" },
            isShow: true,
        },
        {
            __component: "shared.about-section",
            title: "Our Story of Excellence",
            description: "<p>At Di'aaru, we believe that true luxury isn't just about beauty—it's about responsibility, craftsmanship, and timeless value.</p><p>Founded on the principle that exceptional diamonds should be accessible without compromising ethics or the environment, we've pioneered the art of creating laboratory-grown diamonds that are chemically, physically, and optically identical to mined diamonds.</p><p>Every Di'aaru diamond begins as a tiny seed in our state-of-the-art facility, where cutting-edge technology and centuries-old gemological knowledge combine to create stones of extraordinary brilliance. Our master craftsmen then transform these pristine diamonds into heirloom pieces that will be treasured for generations.</p><p>We're not just selling jewelry—we're offering a new way to celebrate life's precious moments, with beauty that comes from innovation rather than extraction.</p>",
            image: { url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" },
            isShow: true,
        },
        {
            __component: "shared.why-choose-us",
            title: "The Di'aaru Difference",
            isShow: true,
            features: [
                { feature_title: "Unmatched Quality", feature_description: "Every diamond is certified by leading gemological institutes with grades of D-F color and VS1 or better clarity. We never compromise on quality.", icon: "Diamond" },
                { feature_title: "Ethically Created", feature_description: "100% conflict-free and environmentally sustainable. Our lab-grown diamonds have 1/10th the carbon footprint of mined diamonds.", icon: "Leaf" },
                { feature_title: "Master Craftsmanship", feature_description: "Handcrafted by artisans with decades of experience. Each piece is individually inspected to meet our exacting standards.", icon: "Award" },
                { feature_title: "Exceptional Value", feature_description: "Lab-grown diamonds cost 40-60% less than mined equivalents, allowing you to choose a larger, higher-quality stone within your budget.", icon: "Tag" }
            ],
        },
        {
            __component: "shared.testimonial-section",
            section_title: "Stories From Our Clients",
            isShow: true,
            testimonials: [
                { customer_name: "Sarah & Michael Thompson", review: "<p>We spent months searching for the perfect engagement ring, and Di'aaru exceeded every expectation. The 1.8-carat cushion cut is absolutely breathtaking, and knowing it's ethically created makes it even more special.</p>" },
                { customer_name: "Jennifer Martinez", review: "<p>As someone who values sustainability, I was thrilled to discover Di'aaru. My anniversary band is exquisite—the emerald cut stones are perfectly matched and the craftsmanship is impeccable. It's luxury with a conscience.</p>" },
                { customer_name: "David Chen", review: "<p>I proposed with a Di'aaru solitaire and my fiancée hasn't stopped admiring it! The brilliance is incredible, and the entire process was seamless—from virtual consultation to custom design to delivery.</p>" }
            ],
        },
        {
            __component: "shared.contact-section",
            title: "Begin Your Journey",
            address: "456 Fifth Avenue, Suite 2800\nNew York, NY 10018\nUnited States",
            phone: "+1 (212) 555-DIAM (3426)",
            email: "concierge@diaaru.com",
            map_link: "https://maps.google.com",
            isShow: true,
        }
    ]
};

async function updateHome() {
    try {
        await initializeDatabase();
        const pageRepo = AppDataSource.getRepository(Page);
        const sectionRepo = AppDataSource.getRepository(PageSection);

        let homePage = await pageRepo.findOne({ where: { slug: 'home' }, relations: ['sections'] });

        if (homePage) {
            // Clear old sections
            if (homePage.sections && homePage.sections.length > 0) {
                await sectionRepo.remove(homePage.sections);
            }

            const newSections = homePageData.sections.map((section: any, index: number) => {
                const { __component, isShow, ...content } = section;
                return sectionRepo.create({
                    type: __component,
                    isShow: isShow,
                    order: index,
                    content: content,
                    page: homePage
                });
            });

            homePage.seoTitle = homePageData.seoTitle;
            homePage.seoDescription = homePageData.seoDescription;
            homePage.sections = await sectionRepo.save(newSections);

            await pageRepo.save(homePage);
            console.log('✅ Home page sections successfully updated.');
        } else {
            console.log('Home page not found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

updateHome();
