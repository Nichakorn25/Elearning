import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button, Input, Form, message, Select, Spin } from "antd";
import { ListBanks, GetSellerById, UpdateSellerById } from "../../services/https/index";
import "./EditSealUser.css";
import { BankInterface } from "../../Interface/Bank";



const { Option } = Select;


interface EditSealUserProps {
  visible: boolean;
  onClose: () => void;
}

const EditSealUser: React.FC<EditSealUserProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [banks, setBanks] = useState<BankInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sellerId = localStorage.getItem("sellerId");
        if (!sellerId) {
          message.error("ไม่พบ ID ผู้ขายใน localStorage");
          onClose();
          return;
        }

        const bankResponse = await ListBanks();
        if (bankResponse.status === 200 && bankResponse.data.data) {
          setBanks(bankResponse.data.data);
        } else {
          message.error("ไม่สามารถดึงข้อมูลธนาคารได้");
        }

        const sellerResponse = await GetSellerById(sellerId);
        if (sellerResponse.status === 200 && sellerResponse.data) {
          const sellerData = sellerResponse.data;
          form.setFieldsValue({
            username: sellerData.Name,
            bank: sellerData.SellerBankAccount[0]?.BankID,
            accountNumber: sellerData.SellerBankAccount[0]?.BankNumber,
          });
        } else {
          message.error("ไม่สามารถดึงข้อมูลผู้ขายได้");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchInitialData();
    }
  }, [form, visible, onClose]);

  const handleUpdateUser = async () => {
    setSaving(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const sellerId = localStorage.getItem("sellerId");
      const userID = localStorage.getItem("id");

      if (!sellerId || !userID) {
        message.error("ข้อมูลไม่สมบูรณ์ใน localStorage");
        setSaving(false);
        return;
      }

      const dataToSave = {
        Name: values.username,
        UserID: Number(userID),
        SellerBankAccount: [
          {
            BankID: values.bank,
            BankNumber: values.accountNumber,
          },
        ],
      };

      const response = await UpdateSellerById(sellerId, dataToSave);
      if (response.status === 200) {
        message.success("อัปเดตข้อมูลผู้ขายสำเร็จ");
        onClose();
      } else {
        message.error("เกิดข้อผิดพลาด: " + response.data.message);
      }
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
      message.error("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  return (
<Modal
  title={<div className="edit-seal-user-modal-title">แก้ไข/ดู บัญชี</div>}
  visible={visible}
  onCancel={onClose}
  footer={
    <div className="edit-seal-user-footer">
      <Button
        key="submit"
        className="editseller-Button"
        loading={saving}
        onClick={handleUpdateUser}
      >
        บันทึก
      </Button>
    </div>
  }
  className="edit-seal-user-modal-content"
>
{loading  ? (
  <div className="fullscreen-loading">
    <Spin size="large" tip="กำลังโหลดข้อมูล..." />
  </div>
)  : (
    <Form form={form} layout="vertical" className="edit-seal-user-form-item">
      <Form.Item
        label="ชื่อผู้ใช้"
        name="username"
        className="edit-seal-user-form-item"
        rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
      >
        <Input className="edit-seal-user-input" placeholder="กรอกชื่อผู้ใช้" />
      </Form.Item>
              <Form.Item
          label="เลือกธนาคาร"
          name="bank"
          className="edit-seal-user-form-item"
          rules={[{ required: true, message: "กรุณาเลือกธนาคาร" }]}
        >
          <Select
            className="edit-seal-user-select-selector"
            dropdownClassName="edit-seal-user-select-dropdown"
            placeholder="เลือกธนาคาร"
          >
            {banks.map((bank) => (
              <Option key={bank.ID} value={bank.ID}>
                {bank.BankName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="เลขบัญชีธนาคาร"
          name="accountNumber"
          className="edit-seal-user-form-item"
          rules={[
            { required: true, message: "กรุณากรอกเลขบัญชีธนาคาร" },
            {
              pattern: /^[0-9]+$/, // ตรวจสอบว่าเป็นตัวเลขเท่านั้น
              message: "เลขบัญชีต้องเป็นตัวเลขเท่านั้น",
            },
            {
              validator(_, value) {
                if (value && value.length >= 10) {
                  return Promise.resolve(); // ผ่านการตรวจสอบ
                }
                return Promise.reject("เลขบัญชีต้องมีอย่างน้อย 10 หลัก");
              },
            },
          ]}
        >
          <Input className="edit-seal-user-input" placeholder="กรอกเลขบัญชีธนาคาร" />
        </Form.Item>
    </Form>
  )}
</Modal>
  );
};

export default EditSealUser;