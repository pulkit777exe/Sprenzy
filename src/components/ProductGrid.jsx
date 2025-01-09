import { ProductCard } from "./ProductCard";

const products = [
  {
    id: 1,
    title: "Premium California Almonds",
    description: "Raw, unsalted premium quality almonds rich in nutrients",
    price: 14.99,
    image: "https://m.media-amazon.com/images/I/61Foi5gqs8L._AC_UL320_.jpg",
    amazonUrl: "https://www.amazon.in/Yogabar-Almonds-California-Magnesium-Immunity/dp/B0C8WBPD73/ref=sr_1_11?crid=39S6Q3ZRDF00C&dib=eyJ2IjoiMSJ9.ftFQw3z-J8puRqt6nwMU5KadRY4sf4QRPt7va1fPZ534-sx5PhQgoO6de0uAuXJsFmBpadm1snxKJWF73Yq8qfrxRtN201O9qG0CVzPgSjDv7SjIf2rir-BpPRXVYDj9mScKvDK8rjryY1Nk2qAHLsu0KayIPc7QfRG0VuWyGAY7cIq6MLIGKjKDZtyGeoKdx7FXUpgVdcqlv8eX0tDJ_gJ6hW-_EhwGxn4QYlniPfOKIC1zXL4vA_UPOuqb2_XAfKq5n4QjPzaQ6OVlZVro1LAyfGvUXaktP0h8K4JjpuQlt7wfwFlm0MneSX94gCU7iuO7EUM_Z08uHhyiQzACT8zV9K0BMaRValqdMlfVOSSP8Pg43mpUDkNxWraH9UlVbO0JF48J1ihNG8SS0KNKWpoWRrM876z9FQEKfnhiw3fMK407pvj0i0f2oqjXd3m4.gbSEiRr7FCyYzjEDdEgtk74vN19Se_CxpsRkzg--9_Q&dib_tag=se&keywords=almonds&qid=1736361796&sprefix=almon%2Caps%2C419&sr=8-11",
  },
  {
    id: 2,
    title: "Organic Medjool Dates",
    description: "Large, soft and naturally sweet Medjool dates",
    price: 12.99,
    image: "https://m.media-amazon.com/images/I/61v8WrtR4iL._SX522_.jpg",
    amazonUrl: "https://www.amazon.in/Del-Monte-Royal-Arabian-Dates/dp/B0C1V5WPC9/ref=sr_1_5?crid=5LSWQ8YCUH3U&dib=eyJ2IjoiMSJ9.Ylr4acVlTcE-2wcjLI6nb0At6WBHPeAwRFzgnlU-MwRo6LNyzqBkUcDWRChVioYdUOwAoXamUlB7MgbIfakJGct6Hc_77VJAgeP2590B4OhzY4h2L7GnTHE_Wf7XO-7rXhXkJUSDdymmUgEFVMkligN5esNFVFAUNiAtN1SvWtbh2Ytne_TxVg9a1LWEcMIaTY4NGbBPwUjCRMkLgcsU-8pC6gESDgN1i2yuMw3_IrFNPUJlyWcqvpCYTlysViQ3VxBu8W8u2VSy9p3G7jPxnF73dqOlmDMxDfn2glGcsVSUdtPAZQcgJ60CiTaRq8QXFHaYMEEn-Hx2OMCOKD4wqqh5aaGnxKhWTdNw2mOh9dS6fWp3MOgec6ERznfmreb7UFrwP8Tm8Aek63Oyb-N4IunXnx6--vJUJm-5wdcAAhSlQW3ohLLYXYFbswvp3WDI.wjynw-rDyQFKfQkoYtV0hXW5WBaUb9Vh4QPwaJ0Glr0&dib_tag=se&keywords=dates&qid=1736361849&sprefix=date%2Caps%2C354&sr=8-5",
  },
  {
    id: 3,
    title: "Turkish Dried Figs",
    description: "Premium dried figs, naturally sweet and fiber-rich",
    price: 11.99,
    image: "https://m.media-amazon.com/images/I/711ZYkWNDmL._SX522_.jpg",
    amazonUrl: "https://www.amazon.in/Happilo-Premium-Afghani-Anjeer-200g/dp/B0758D65V3/ref=sr_1_5?crid=1YUAMBWAU9I9U&dib=eyJ2IjoiMSJ9.MmjE8bnyzHcTEx-GUrylsi0aqMMR7A1SnV9o8GoX6GtKDUiya_zRWjsNSSK83AICJQ1PAxolKFZZhlsXSE1bIWjJnIEYPykx5xclk5gm6whNVeef7esDxEF7urmYQkpmzh-SD2jaaHMEGXb_psvB37zViFLH5k7OA9qz332FhP8HPU-YeHfcT3GYyT5lsAbGYyPVdiFE6gU6queOvzpo9453RtBja44wLVib_42DlMEtXY4lXPvMF7BcU3KgJDvqhBfH9lAtI0KQmMY0PNNaZ_XlWORjdDnDwPG5NjiYFLYCVW7yOpg22iAt81UoqHtwnDUtkQRdk11Tc7_o30-lenTLyEU4JAouSUeon6Fp4JAQsP8325-0DqP_rp9TVDMrgBx42zH0wNMnoGet9bTBaVidhVaqp3zTLb8lJf2v3ds6xK40Dx5qHx54t7Hm1ueT.ANVmB95n5qs5ymE78XbP6QuxakJ2FnYepcAJAibiceQ&dib_tag=se&keywords=figs&qid=1736361902&sprefix=fig%2Caps%2C361&sr=8-5",
  },
  {
    id: 4,
    title: "Mixed Dried Berries",
    description: "Antioxidant-rich blend of cranberries, blueberries, and goji berries",
    price: 16.99,
    image: "https://m.media-amazon.com/images/I/413pXGbUjwL._SX300_SY300_QL70_FMwebp_.jpg",
    amazonUrl: "https://www.amazon.in/Farmley-Tasty-Berry-Trail-Mix/dp/B09LD3ZB96/ref=sr_1_5?crid=2TIF3UUGJ80KM&dib=eyJ2IjoiMSJ9.aTykA4m9DoE-ihmdWBGYayQC6zjzxKLScGm3INKAtyBfJye19vepLq1MKmLPHUW2U5UyK7OVfNVckaYJkHBG0a2w7nO2kxRcx3Jh8Js5sF6CH3USYljib7loXim9Iz0QQmtaqPYwKbaIFvEclEur9YXs3COZj2i-UiJy4owF4ra51HQswD5Ef1d_xiP-o7weNe8ZX2kwxi0WNyhHaVhZPImnXCrsBooDGn9K_oggaKrNkOToZhJ1hwSM3Xey-tYAy8aZ9nEG8XKx_yD__XmAbbf6p9COACo1EKjSMdsGapTVIavFqjGDXaWzywBKmIgL4yj6CVcYQBSrimzrAZ8GMkv1gviS8lYlK_KpSwzsVmG2d6pUfxYY4YCpVXQDg8a4sygm3ZvwqchGBElXeQ-0S4D8o6SHIAiZd3I-biYH2uEasqxmZEj_xedGqCcxCdGD.Nf7IW0ToRXeo3fkaCC7ZJ0851hOK34ws_uGfZqIyLMM&dib_tag=se&keywords=berries&qid=1736361958&sprefix=berrie%2Caps%2C471&sr=8-5",
  },
];

export const ProductGrid = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};