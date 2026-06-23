/**
 * B2B Catalogue data
 * ──────────────────
 * Mỗi catalogue là 1 cuốn brochure dạng flipbook.
 * Trang layout chuẩn (theo file in ấn):
 *   - page-01  → bìa trước (single)
 *   - page-02..(n-1)  → ruột (xếp đôi: 2-3, 4-5, …)
 *   - page-N   → bìa sau (single)
 * Ảnh đặt trong public/catalogue/<slug>/page-NN.jpg
 *
 * Một số trang đặc biệt (vd. trang cut-out có alpha) dùng .png thay vì .jpg.
 * Khai báo các trang đó trong `cutoutPages` (1-indexed).
 *
 * Để thêm cuốn mới: thêm 1 object vào mảng `catalogues` bên dưới,
 * rồi bỏ ảnh vào public/catalogue/<slug>/.
 */

export interface Catalogue {
  /** Dùng làm URL: /catalogue/<slug> */
  slug: string;
  /** Tên hiển thị trên grid và header flipbook */
  title: string;
  /** Vùng (hiển thị nhỏ trên card) */
  region: string;
  /** Mô tả ngắn 1 dòng trên card */
  tagline: string;
  /** Tổng số trang */
  totalPages: number;
  /** Ảnh dùng làm preview trên grid (thường là page-01 — bìa trước) */
  coverImage: string;
  /**
   * Các trang có hiệu ứng cut-out (PNG có alpha, không phải JPG).
   * 1-indexed. Ví dụ [1] = trang 1 dùng page-01.png.
   */
  cutoutPages?: number[];
  /**
   * Map trang cut-out → mảng các trang xếp lớp phía sau lúc still.
   * Key 1-indexed. Value là mảng trang theo thứ tự TỪ ĐÁY LÊN
   * (phần tử đầu = đáy nhất, phần tử cuối = ngay dưới trang đang xem).
   * Ví dụ {1: [3, 2]} = dưới trang 1 stack: page-03 (đáy) → page-02 → page-01 (đang xem).
   */
  peekBehind?: Record<number, number[]>;
}

export const catalogues: Catalogue[] = [
  {
    slug: 'hcm-a-life',
    title: 'Ho Chi Minh: A Life',
    region: 'Southern Vietnam',
    tagline: 'A walking biography through the city that shaped a nation.',
    totalPages: 20,
    coverImage: '/catalogue/hcm-a-life/page-01.jpg',
    cutoutPages: [1, 2], // trang 1 + 2 có hiệu ứng cut-out layered (PNG có alpha)
    /**
     * Map trang cut-out → trang hiển thị PHÍA SAU lúc still (chưa flip).
     * StPageFlip không tự layer trang đầu lên trang sau khi chưa flip,
     * nên ta dùng CSS background-image để giả lập. Khi user bắt đầu lật,
     * engine sẽ vẽ bottomPage thật chồng lên → không gây nhảy ảnh.
     */
    /**
     * Trang 1 và 2 đều cut-out. Stack hiển thị:
     *   - Lúc nhìn trang 1 (chưa lật): page-03 (đáy đặc) + page-02 (cut-out giữa) + page-01 (trên cùng).
     *   - Lúc xem spread 2+3 (đã lật trang 1): trang 2 KHÔNG còn cần peek
     *     (vì nó nằm cạnh trang 3, không ở trên trang 3). Alpha của trang 2
     *     khi đó chỉ lộ background section (light-cyan).
     */
    peekBehind: {
      1: [3, 2], // dưới trang 1: page-03 ở đáy, page-02 ngay dưới page-01
      // Trang 2: không có peek-stack — các "lỗ" alpha chỉ lộ background.
    },
  },
  {
    slug: 'sapa-laichau',
    title: 'Sa Pa – Lai Châu',
    region: 'Northwest Vietnam',
    tagline: 'Motortour through cloud-wrapped passes and Tai Dam villages.',
    totalPages: 22,
    coverImage: '/catalogue/sapa-laichau/page-01.jpg',
  },
];

/**
 * Helper: lấy mảng URL tất cả các trang theo thứ tự.
 * Trả về .png cho các trang được khai báo trong cutoutPages, .jpg cho phần còn lại.
 */
export function getPageUrls(cat: Catalogue): string[] {
  const urls: string[] = [];
  const cutout = new Set(cat.cutoutPages ?? []);
  for (let i = 1; i <= cat.totalPages; i++) {
    const n = String(i).padStart(2, '0');
    const ext = cutout.has(i) ? 'png' : 'jpg';
    urls.push(`/catalogue/${cat.slug}/page-${n}.${ext}`);
  }
  return urls;
}
