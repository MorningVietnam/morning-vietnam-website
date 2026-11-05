/**
 * localFriends.ts — "Our Local Friends" (trang chủ, giữa The Crew và Testimonials)
 *
 * Nội dung lấy NGUYÊN VĂN từ bản đã audit (portfolio B2B "Our Local Compass").
 * Sửa chữ ở đây, không sửa trong index.astro.
 *
 * - Dùng **chữ đậm** bằng cặp dấu ** ở hai đầu cụm từ.
 * - Mỗi phần tử trong `paragraphs` là một đoạn văn.
 * - Ảnh: bỏ file vào  public/local-friends/<slug>.jpg  (ảnh vuông, mặt ở giữa,
 *   tối thiểu 600×600px). Chưa có ảnh thì web tự hiện chữ cái đầu thay thế.
 * - Thứ tự trong mảng = thứ tự hiển thị.
 */

export interface LocalFriend {
  slug:       string;
  initials:   string;
  name:       string;
  identity:   string;      // dòng 1 dưới tên: ai (vd. "Local H'Mông")
  role:       string;      // dòng 2: làm gì ở đâu (vd. "Tour Guide in Sa Pa")
  image:      string;
  paragraphs: string[];
}

export const localFriends: LocalFriend[] = [
  {
    slug: "rua",
    initials: "R",
    name: "Lý Thị Rủa",
    identity: "Local H'Mông",
    role: "Tour Guide in Sa Pa",
    image: "/local-friends/rua.jpg",
    paragraphs: [
      "Young as she is, **Rủa** already carries **remarkable local knowledge and a strong command of English**. Born in Tả Van, she later married in Tà Phìn by the H’Mông tradition of “bride kidnapping.”",
      "As a shy young girl, she watched European travelers walk past her home while accompanying her parents to sell handmade bracelets and embroidered bags.",
      "That was where she began developing her English. Today, a mother of three, she **welcomes travelers into her home, sharing the stories and traditions of her community**.",
    ],
  },
  {
    slug: "chien",
    initials: "C",
    name: "Nguyễn Mạnh Chiến",
    identity: "Nam Định native",
    role: "Trekking Pioneer in Northwest Vietnam",
    image: "/local-friends/chien.jpg",
    paragraphs: [
      "Chiến was one of **the early pioneers of Vietnam’s trekking movement**. Since the 2010s, long before the Northwest’s high peaks became popular with travelers, he and his team had **surveyed trails**, **opened routes**, and **marked some of Vietnam’s highest summits.**",
      "Of **15 mysterious peaks known mainly through military maps or local ethnic names**, Chiến helped bring 13 into the public eye. As a long-time admin of the “Vietnam Mountain Climbing Enthusiasts” community, he also helped grow Vietnam’s climbing culture.",
      "His work helped connect local communities with trekking, introducing the role of porters and creating new opportunities for people living in remote mountain areas.",
    ],
  },
  {
    slug: "a-la",
    initials: "L",
    name: "Giàng A La",
    identity: "Local H'Mông",
    role: "Homestay Owner & Tour Guide in Lai Châu",
    image: "/local-friends/a-la.jpg",
    paragraphs: [
      "Born in 1996, **A La** is a cultural bridge between generations. In **Hang Kia–Pà Cò**, he preserves and shares the traditional way of life of his community with travelers.",
      "Despite the challenges of living in a remote area, A La continues to learn marketing and hospitality management to **develop his small, culture-rich homestay**. Every detail is cared for, with stories and traditions shared naturally with guests.",
      "After a mountain meal and a glass of corn wine, the sound of **A La’s khèn** around the fire brings back the atmosphere of the highlands from generations ago.",
    ],
  },
  {
    slug: "thanh",
    initials: "T",
    name: "Lò Văn Thanh",
    identity: "Local Black Thai",
    role: "Tourism Promotion Officer in Lai Châu",
    image: "/local-friends/thanh.jpg",
    paragraphs: [
      "Born in former Điện Biên Province, which was divided into Lai Châu and Điện Biên in 2003, Thanh **developed a strong passion for tourism** in his home province from an early age.",
      "Fluent in **Vietnamese, Thai, Lao, and Chinese**, he has worked in tourism for **more than 20 years**. Throughout his career, he has represented Lai Châu at both **international and domestic tourism fairs**, contributing to the province’s tourism development and promotion.",
    ],
  },
  {
    slug: "a-pao",
    initials: "P",
    name: "Phàn A Páo",
    identity: "Local Dao",
    role: "Mountain Porter in Sa Pa & Lai Châu",
    image: "/local-friends/a-pao.jpg",
    paragraphs: [
      "Vietnam’s trekking season runs from mid-September to mid-April. Outside the season, A Páo works in construction in the lowlands to support his family.",
      "**Strong, experienced in the forest, and thoughtful**, he is a **trusted leader** who always stays at the back of the group to support the last guests. At camp, he **prepares simple local dishes**, sometimes even catching frogs or fish on rainy nights to cook for trekkers. His hope is to work in tourism year-round, stay closer to his family, and **create better opportunities for his highland community**.",
    ],
  },
];
