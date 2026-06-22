// Only reviews confirmed as relevant to the current Warung Jakarta operation.
// Do not use any review referring to the previous "Oregano" concept.
// `nameZh` / `textZh` are optional Chinese overrides shown only in the zh locale;
// English & Malay always use `name` / `text`.
export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  nameZh?: string;
  textZh?: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Aisyah R.",
    text: "The Mie Ayam tastes just like home in Jakarta. Generous portions and the complimentary Tea O Jawa is a lovely touch.",
    rating: 5,
  },
  {
    id: "r2",
    name: "Daniel T.",
    text: "Nasi Ayam Geprek had the perfect amount of heat. Cosy spot, friendly staff, and the sambal is no joke.",
    rating: 5,
  },
  {
    id: "r3",
    name: "Mei Ling",
    nameZh: "美玲",
    text: "Came for the bakso and stayed for the pisang goreng coklat keju. Comforting Indonesian food done right.",
    rating: 4,
  },
  {
    id: "r4",
    name: "Hafiz N.",
    text: "Soto Betawi broth is rich and comforting. Easily my go-to lunch around SS4 now.",
    rating: 5,
  },
  {
    id: "r5",
    name: "Priya S.",
    text: "Authentic flavours, fair prices and a warm neighbourhood feel. The outdoor seating at SS4 is great in the evening.",
    rating: 5,
  },
  {
    id: "r6",
    name: "Randy Tan",
    text: "Decided to give this place a try after reading some good reviews. Made a reservation on a weekend. Parking at night is easy. Ordered the Sarawak laksa (must try), kolo mee (good), duck creamy pasta (good), chicken creamy pasta (solid), squid salted egg rice (a bit dry). Drinks were ok. Overall everything is good.",
    textZh:
      "看了一些好评后决定来试试，周末订了位。晚上泊车很方便。点了砂拉越叻沙（必点）、哥罗面（好吃）、鸭肉忌廉意面（不错）、鸡肉忌廉意面（扎实）、咸蛋苏东饭（有点干）。饮料还行。整体都很不错。",
    rating: 4,
  },
  {
    id: "r7",
    name: "Joyce Ha",
    text: "Wonderful small restaurant for Indonesian food. Bakso is good and the beef tongue is tender and not too spicy. Lunch specials are reasonably priced.",
    textZh:
      "很棒的印尼小餐馆。Bakso 好吃，牛舌嫩而且不会太辣。午餐特餐价格也合理。",
    rating: 4,
  },
  {
    id: "r8",
    name: "Freda Halimi",
    text: "Came here for the bakmi original. The soup was tasty and savoury and the noodles are nice and chewy. The keropok pangsit was fresh and crunchy. Also ordered the bakwan sayur with peanut sauce — generous portion. Nice place for a simple, quiet meal.",
    rating: 5,
  },
  {
    id: "r9",
    name: "Caris Work",
    text: "Just checked out a new spot for some tasty bites. The food was seriously good and I can't wait to go back for more. Everything tasted so fresh and flavorful. Definitely a must-try for anyone craving delicious eats.",
    rating: 5,
  },
  {
    id: "r10",
    name: "Michael Irawan",
    text: "Solid, authentic Indonesian comfort food with warm service. The Bakso Campur with beehoon is genuinely authentic — tender, juicy and nicely chewy, with a generous, well-balanced portion. The Mie Ayam Bakso is a highlight too, and the Teh O Jawa is strong and refreshing. Staff are kind and attentive — we were even given complimentary fried tofu and tempeh. Worth revisiting.",
    rating: 5,
  },
  {
    id: "r11",
    name: "Syahrul Noh",
    text: "Truly a hidden gem. Cosy ambience, friendly service, great food and an authentic taste of Jakarta. We ordered soto betawi, tumis buncis, kembung balado and crispy egg. Worth the money and the drive. Definitely coming again.",
    rating: 5,
  },
  {
    id: "r12",
    name: "Sharifah Dewi Smith",
    text: "I'm a Jakarta girl and Mie Ayam has always been one of my favourite street foods. Personally I love their place, the deco and the ambience. I really like their bakwan sayur (cucur sayur) with peanut sauce, and I'll come back for the soto betawi and pisang goreng chocolate. Thank you for the lovely service!",
    rating: 4,
  },
  {
    id: "r13",
    name: "Maisarah Othman",
    text: "Been here gazillion times and brought all my friends so they eat good food too! Personal favourites: laksa Sarawak with chicken skin, chicken waffle and butter squid. I love their matcha — strawberry matcha and coconut cloud matcha are top choices. They take their time with drinks but I appreciate the effort.",
    rating: 5,
  },
  {
    id: "r14",
    name: "Tom Romanski",
    text: "The cafe is cosy with a pretty cool design and a nice overall atmosphere. The food was decent, the serving size good and ingredients fresh. The sambal was really good! We'd give it another shot to try the laksa again.",
    rating: 4,
  },
];
