export interface PaymentMethodInterface {
    id?: number; // ใช้ `?` เพื่อให้เป็น optional สำหรับการสร้างใหม่
    name: string;
    type: string; // ประเภทของวิธีการ เช่น qr, bank
    account?: string; // เลขบัญชี (อาจไม่จำเป็นสำหรับบางประเภท เช่น QR Code)
    accountName?: string; 
    createdAt?: string;
    updatedAt?: string;
  }
  