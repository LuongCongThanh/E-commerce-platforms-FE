import type { HomeBenefit } from '@/modules/home/types/homeBenefit';

export const homeBenefitsData: HomeBenefit[] = [
  { id: 'shipping', icon: 'Truck', title: 'Miễn phí vận chuyển', description: 'Đơn hàng từ 300.000đ được miễn phí ship toàn quốc.' },
  { id: 'returns', icon: 'RotateCcw', title: 'Đổi trả 30 ngày', description: 'Không hài lòng? Đổi trả miễn phí trong vòng 30 ngày.' },
  { id: 'authentic', icon: 'ShieldCheck', title: 'Hàng chính hãng 100%', description: 'Cam kết tất cả sản phẩm đều có nguồn gốc rõ ràng.' },
  { id: 'support', icon: 'HeadphonesIcon', title: 'Hỗ trợ 24/7', description: 'Đội ngũ CSKH sẵn sàng hỗ trợ bất cứ lúc nào.' },
];
