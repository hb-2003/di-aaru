import "reflect-metadata";
import { AppDataSource, initializeDatabase } from './src/lib/db/config';
import { Global, About, Product, Page, PageSection } from './src/lib/db/models';
import slugify from 'slugify';

const extraProducts = [
  {
    name: "1.5 Carat Brilliant Round Lab Grown Diamond",
    description:
      "Exquisite 1.5 carat round brilliant cut lab grown diamond. This stone features exceptional VVS1 clarity and E color grade, offering maximum fire and brilliance. Perfect for an engagement ring or a timeless pendant.",
    price: 2400.0,
    diamondType: "Lab Grown" as const,
    carat: 1.5,
    shape: "Round",
    images: ["diamond-round.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "2.0 Carat Princess Cut Lab Grown Diamond",
    description:
      "Stunning 2.0 carat princess cut lab grown diamond. Known for its modern look and sharp geometric lines, this IF clarity stone has a D color grade, representing the pinnacle of lab-grown quality.",
    price: 4200.0,
    diamondType: "Lab Grown" as const,
    carat: 2.0,
    shape: "Princess",
    images: ["diamond-princess.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "1.2 Carat Emerald Cut Lab Grown Diamond",
    description:
      "Elegant 1.2 carat emerald cut diamond with long, step-cut facets that create a unique 'hall of mirrors' effect. VS1 clarity and F color grade. A sophisticated choice for classic jewelry.",
    price: 1850.0,
    diamondType: "Lab Grown" as const,
    carat: 1.2,
    shape: "Emerald",
    images: ["diamond-3.jpg"],
    featured: false,
    isShow: true,
  },
  {
    name: "1.75 Carat Oval Cut Lab Grown Diamond",
    description:
      "Beautiful 1.75 carat oval cut diamond that offers an elongated appearance, making it look larger than a round diamond of the same weight. VVS2 clarity and G color.",
    price: 2900.0,
    diamondType: "Lab Grown" as const,
    carat: 1.75,
    shape: "Oval",
    images: ["diamond-4.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "2.5 Carat Cushion Cut Lab Grown Diamond",
    description:
      "Luxurious 2.5 carat cushion cut diamond with rounded corners and larger facets for increased sparkle. Ideal for vintage-inspired settings. VS2 clarity, H color.",
    price: 5100.0,
    diamondType: "Lab Grown" as const,
    carat: 2.5,
    shape: "Cushion",
    images: ["diamond-5.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "1.0 Carat Pear Cut Lab Grown Diamond",
    description:
      "Unique 1.0 carat pear-shaped lab grown diamond, also known as a teardrop. Perfect for a pendant or a distinctive engagement ring. VVS1 clarity, E color.",
    price: 1600.0,
    diamondType: "Lab Grown" as const,
    carat: 1.0,
    shape: "Pear",
    images: ["diamond-6.jpg"],
    featured: false,
    isShow: true,
  },
  {
    name: "1.3 Carat Heart Shape Lab Grown Diamond",
    description:
      "Romantic 1.3 carat heart-shaped lab diamond. A symbol of love and affection, this stone is cut to perfection. IF clarity, D color.",
    price: 2100.0,
    diamondType: "Lab Grown" as const,
    carat: 1.3,
    shape: "Heart",
    images: ["diamond-7.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "3.0 Carat Radiant Cut Lab Grown Diamond",
    description:
      "Impressive 3.0 carat radiant cut lab diamond, combining the cut of an emerald with the brilliance of a round diamond. VS1 clarity, F color.",
    price: 7500.0,
    diamondType: "Lab Grown" as const,
    carat: 3.0,
    shape: "Radiant",
    images: ["diamond-8.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "1.1 Carat Marquise Cut Lab Grown Diamond",
    description:
      "Distinctive 1.1 carat marquise cut diamond with pointed ends and a boat-like shape. Provides a dramatic and elegant look. VVS2 clarity, G color.",
    price: 1750.0,
    diamondType: "Lab Grown" as const,
    carat: 1.1,
    shape: "Marquise",
    images: ["diamond-9.jpg"],
    featured: false,
    isShow: true,
  },
  {
    name: "2.2 Carat Asscher Cut Lab Grown Diamond",
    description:
      "Classic 2.2 carat Asscher cut diamond with a square shape and high crown. This art deco style stone offers timeless elegance. VS1 clarity, E color.",
    price: 4800.0,
    diamondType: "Lab Grown" as const,
    carat: 2.2,
    shape: "Asscher",
    images: ["diamond-10.jpg"],
    featured: true,
    isShow: true,
  },
];

const initialProducts = [
  {
    name: "Eternal Solitaire Ring",
    description:
      "<p>A timeless masterpiece featuring a stunning 1.5-carat round brilliant lab-grown diamond set in 18K white gold. This classic solitaire design showcases the diamond's exceptional brilliance with a delicate four-prong setting that maximizes light reflection.</p><p>Each diamond is ethically created in our state-of-the-art facility, ensuring conflict-free sourcing and environmental responsibility.</p>",
    price: 5999.0,
    diamondType: "Lab Grown" as const,
    carat: 1.5,
    shape: "Round Brilliant",
    images: ["diamond-round-ring.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "Princess Cut Halo Engagement Ring",
    description:
      "<p>Exquisite princess cut center stone (2.0ct) surrounded by a halo of smaller brilliant diamonds, creating a stunning celestial effect. Set in platinum for ultimate durability and elegance.</p><p>The halo design adds approximately 0.5 carats of accent diamonds, enhancing the overall brilliance and making the center stone appear larger.</p>",
    price: 8499.0,
    diamondType: "Lab Grown" as const,
    carat: 2.0,
    shape: "Princess",
    images: ["diamond-princess-ring.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "Cushion Cut Three-Stone Ring",
    description:
      "<p>A romantic three-stone design featuring a 1.8-carat cushion cut center diamond flanked by two matching side stones (0.5ct each). The vintage-inspired setting in rose gold adds warmth and character.</p><p>Symbolizing your past, present, and future together, this timeless design has been cherished for generations.</p>",
    price: 7299.0,
    diamondType: "Lab Grown" as const,
    carat: 1.8,
    shape: "Cushion",
    featured: true,
    isShow: true,
  },
  {
    name: "Emerald Cut Eternity Band",
    description:
      "<p>Sophisticated emerald cut diamonds (total 3.0ct) set in a continuous 18K yellow gold band. Each stone is carefully selected for consistent color and clarity, creating a seamless line of brilliance.</p><p>Perfect as a wedding band or anniversary gift, this eternity band represents never-ending love.</p>",
    price: 6799.0,
    diamondType: "Lab Grown" as const,
    carat: 3.0,
    shape: "Emerald",
    featured: false,
    isShow: true,
  },
  {
    name: "Oval Diamond Vintage Ring",
    description:
      "<p>An exquisite 1.6-carat oval diamond in a vintage-inspired setting with intricate milgrain detailing and delicate filigree work. Set in platinum with accent diamonds on the shoulders.</p><p>This design combines old-world craftsmanship with modern diamond technology, creating a unique heirloom piece.</p>",
    price: 6299.0,
    diamondType: "Lab Grown" as const,
    carat: 1.6,
    shape: "Oval",
    featured: true,
    isShow: true,
  },
  {
    name: "Pear Shape Pendant Necklace",
    description:
      "<p>A stunning 1.2-carat pear-shaped diamond suspended from a delicate 18K white gold chain. The classic teardrop silhouette captures and reflects light beautifully from every angle.</p><p>Simple yet elegant, this pendant is versatile enough for daily wear yet sophisticated enough for special occasions.</p>",
    price: 3899.0,
    diamondType: "Lab Grown" as const,
    carat: 1.2,
    shape: "Pear",
    featured: false,
    isShow: true,
  },
  {
    name: "Radiant Cut Cocktail Ring",
    description:
      "<p>Make a statement with this bold 2.5-carat radiant cut diamond cocktail ring. The emerald-cut style with trimmed corners is set in 18K yellow gold with a split shank design adorned with pavé diamonds.</p><p>Perfect for those who appreciate distinctive, eye-catching jewelry that commands attention.</p>",
    price: 9999.0,
    diamondType: "Lab Grown" as const,
    carat: 2.5,
    shape: "Radiant",
    featured: false,
    isShow: true,
  },
  {
    name: "Classic Diamond Stud Earrings",
    description:
      "<p>Timeless elegance in the form of 1.0-carat total weight (0.5ct each) round brilliant diamond studs. Set in 14K white gold with secure screw-back posts for daily comfort and security.</p><p>A wardrobe essential that complements any outfit, from casual to formal.</p>",
    price: 2999.0,
    diamondType: "Lab Grown" as const,
    carat: 1.0,
    shape: "Round Brilliant",
    featured: false,
    isShow: true,
  },
  {
    name: "Marquise Diamond Fashion Ring",
    description:
      "<p>A unique 1.4-carat marquise diamond set east-west in a modern bezel setting. The 18K rose gold band features subtle accent diamonds leading to the center stone.</p><p>This contemporary design is perfect for the modern woman who appreciates unconventional beauty.</p>",
    price: 5499.0,
    diamondType: "Lab Grown" as const,
    carat: 1.4,
    shape: "Marquise",
    featured: false,
    isShow: true,
  },
  {
    name: "Asscher Cut Art Deco Ring",
    description:
      "<p>Vintage Art Deco inspired design featuring a 1.7-carat asscher cut diamond with geometric step cuts that create a hall-of-mirrors effect. Set in platinum with calibré sapphire accents.</p><p>A tribute to the glamorous 1920s, this ring is for the collector of fine, distinctive jewelry.</p>",
    price: 7899.0,
    diamondType: "Lab Grown" as const,
    carat: 1.7,
    shape: "Asscher",
    featured: false,
    isShow: true,
  },
];

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
      description:
        "<p>Ethically crafted, infinitely beautiful. Discover diamonds that reflect not just light, but your values.</p>",
      button_text: "Explore Our Collection",
      button_link: "#products",
      background_image: "diamond-hero.png",
      isShow: true,
    },
    {
      __component: "shared.about-section",
      title: "Our Story of Excellence",
      description:
        "<p>At Di'aaru, we believe that true luxury isn't just about beauty—it's about responsibility, craftsmanship, and timeless value.</p><p>Founded on the principle that exceptional diamonds should be accessible without compromising ethics or the environment, we've pioneered the art of creating laboratory-grown diamonds that are chemically, physically, and optically identical to mined diamonds.</p><p>Every Di'aaru diamond begins as a tiny seed in our state-of-the-art facility, where cutting-edge technology and centuries-old gemological knowledge combine to create stones of extraordinary brilliance. Our master craftsmen then transform these pristine diamonds into heirloom pieces that will be treasured for generations.</p><p>We're not just selling jewelry—we're offering a new way to celebrate life's precious moments, with beauty that comes from innovation rather than extraction.</p>",
      image: "diamond-round.png",
      isShow: true,
    },
    {
      __component: "shared.product-section",
      section_title: "Signature Collection",
      isShow: true,
      products: [], // Will be populated with product IDs
    },
    {
      __component: "shared.why-choose-us",
      title: "The Di'aaru Difference",
      isShow: true,
      features: [
        {
          feature_title: "Unmatched Quality",
          feature_description:
            "Every diamond is certified by leading gemological institutes with grades of D-F color and VS1 or better clarity. We never compromise on quality.",
        },
        {
          feature_title: "Ethically Created",
          feature_description:
            "100% conflict-free and environmentally sustainable. Our lab-grown diamonds have 1/10th the carbon footprint of mined diamonds.",
        },
        {
          feature_title: "Master Craftsmanship",
          feature_description:
            "Handcrafted by artisans with decades of experience. Each piece is individually inspected to meet our exacting standards.",
        },
        {
          feature_title: "Lifetime Warranty",
          feature_description:
            "Comprehensive coverage including complimentary cleaning, resizing, and inspection. Your investment is protected forever.",
        },
        {
          feature_title: "Exceptional Value",
          feature_description:
            "Lab-grown diamonds cost 40-60% less than mined equivalents, allowing you to choose a larger, higher-quality stone within your budget.",
        },
        {
          feature_title: "Personalized Service",
          feature_description:
            "Dedicated jewelry consultants guide you through every step, from selection to customization, ensuring your vision becomes reality.",
        },
      ],
    },
    {
      __component: "shared.testimonial-section",
      section_title: "Stories From Our Clients",
      isShow: true,
      testimonials: [
        {
          customer_name: "Sarah & Michael Thompson",
          review:
            "<p>We spent months searching for the perfect engagement ring, and Di'aaru exceeded every expectation. The 1.8-carat cushion cut is absolutely breathtaking, and knowing it's ethically created makes it even more special. The quality rivals any mined diamond we saw, but at half the price. Our consultant was patient, knowledgeable, and never pressured us. This ring will be in our family for generations.</p>",
        },
        {
          customer_name: "Jennifer Martinez",
          review:
            "<p>As someone who values sustainability, I was thrilled to discover Di'aaru. My anniversary band is exquisite—the emerald cut stones are perfectly matched and the craftsmanship is impeccable. I've received countless compliments, and I love sharing the story of lab-grown diamonds. It's luxury with a conscience.</p>",
        },
        {
          customer_name: "David Chen",
          review:
            "<p>I proposed with a Di'aaru solitaire and my fiancée hasn't stopped admiring it! The brilliance is incredible, and the entire process was seamless—from virtual consultation to custom design to delivery. The certificate of authenticity and detailed care instructions show their commitment to excellence.</p>",
        },
        {
          customer_name: "Emily Rodriguez",
          review:
            "<p>I inherited my grandmother's jewelry but wanted something uniquely mine for my wedding. Di'aaru helped me design a custom piece incorporating elements from her ring. The result is stunning—a perfect blend of vintage sentiment and modern beauty. The team's artistry and attention to detail are unmatched.</p>",
        },
      ],
    },
    {
      __component: "shared.gallery-section",
      title: "Craftsmanship Gallery",
      isShow: true,
      images: [
        "luxury_diamond_macro.png",
        "floating_diamond.png",
        "diamond_group_velvet.png",
        "diamond_refraction_effect.png",
        "minimal_luxury_diamond_bg.png",
        "ice_style_diamond_concept.png",
      ],
    },
    {
      __component: "shared.contact-section",
      title: "Begin Your Journey",
      address:
        "456 Fifth Avenue, Suite 2800\nNew York, NY 10018\nUnited States",
      phone: "+1 (212) 555-DIAM (3426)",
      email: "concierge@diaaru.com",
      map_link: "https://maps.google.com",
      isShow: true,
    },
  ],
};

async function seed() {
  try {
    console.log('⏳ Initializing database...');
    await initializeDatabase();

    const globalRepo = AppDataSource.getRepository('Global');
    const aboutRepo = AppDataSource.getRepository('About');
    const productRepo = AppDataSource.getRepository('Product');
    const pageRepo = AppDataSource.getRepository('Page');

    console.log('⏳ Seeding Single Types...');

    // Seed Global Settings
    let global = await globalRepo.findOne({ where: { id: 1 } });
    if (!global) {
      global = globalRepo.create({
        id: 1,
        siteName: 'Diaaru',
        siteDescription: 'Exquisite Diamond Jewelry',
      });
      await globalRepo.save(global);
      console.log('✅ Global settings seeded.');
    } else {
      console.log('ℹ️ Global settings already exist.');
    }

    // Seed About Page
    let about = await aboutRepo.findOne({ where: { id: 1 } });
    if (!about) {
      about = aboutRepo.create({
        id: 1,
        title: 'About Diaaru',
        blocks: [],
      });
      await aboutRepo.save(about);
      console.log('✅ About page seeded.');
    } else {
      // Update existing about content with new structure if needed
      if (about.blocks && Array.isArray(about.blocks)) {
        about.blocks = about.blocks.map((block: any, index: number) => {
          const { __component, isShow, ...blockContent } = block;
          return {
            id: block.id,
            type: __component,
            isShow: isShow !== undefined ? isShow : true,
            order: index,
            content: blockContent,
            // ensure required relation/id and timestamps exist for the entity type
            about: about!,
            aboutId: about!.id,
            createdAt: block.createdAt ? new Date(block.createdAt) : new Date(),
            updatedAt: block.updatedAt ? new Date(block.updatedAt) : new Date(),
          };
        });
      }
      await aboutRepo.save(about);
      console.log('✅ About page updated.');
    }

    console.log('⏳ Seeding Products...');
    const allProductsData = [...initialProducts, ...extraProducts];
    const createdProductIds: string[] = [];

    for (const pData of allProductsData) {
      const slug = slugify(pData.name, { lower: true, strict: true });
      let product = await productRepo.findOne({ where: { slug } });

      if (!product) {
        product = productRepo.create({
          ...pData,
          slug,
          status: 'published'
        });
        await productRepo.save(product);
        console.log(`✅ Product created: ${pData.name}`);
      } else {
        console.log(`ℹ️ Product already exists: ${pData.name}`);
      }

      if (pData.featured) {
        createdProductIds.push(product.id);
      }
    }

    console.log('⏳ Seeding Pages...');
    let homePage = await pageRepo.findOne({ where: { slug: 'home' } });
    if (!homePage) {
      // Link featured products to the product section
      const productSectionIndex = homePageData.sections.findIndex(
        (s: any) => s.__component === "shared.product-section",
      );
      if (productSectionIndex !== -1) {
        (homePageData.sections[productSectionIndex] as any).products = createdProductIds.slice(0, 8);
      }

      const { sections, ...pageBaseData } = homePageData;

      homePage = pageRepo.create({
        ...pageBaseData,
        status: 'published',
        sections: sections.map((section: any, index: number) => {
          const { __component, isShow, ...content } = section;
          return {
            type: __component,
            isShow: isShow !== undefined ? isShow : true,
            order: index,
            content
          };
        })
      });
      await pageRepo.save(homePage);
      console.log('✅ Home page seeded.');
    } else {
      console.log('ℹ️ Home page already exists.');
    }

    console.log('✅ Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
