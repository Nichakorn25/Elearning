import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import TextField from '@mui/material/TextField';
import Input from '@mui/joy/Input';
import { CreateContent, CreateVideo, CreateMaterial } from '../../../services/https';
import { CourseContentInterface, CourseUrlInterface } from '../../../Interface/ICourse';
import { useState } from 'react';
import { message} from 'antd';
import { Box, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';


const StyledMenu = styled((props: MenuProps) => (

  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

interface OptionProps {
  LessonID: number; // เพิ่มการประกาศ props LessonID
}

export const CustomizedMenus: React.FC<OptionProps> = ({ LessonID }) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModalContent, setOpenModalContent] = React.useState<boolean>(false);
  const [openModalLink, setOpenModalLink] = React.useState<boolean>(false);
  const [openModalFile, setOpenModalFile] = React.useState<boolean>(false);
  const [ContentData, setContentData] = useState<CourseContentInterface>({
        Title: "",
        Content: "",
        Status: "hide",
        LessonID: LessonID, 
      });

  const handleRefresh = () => {
        setTimeout(() => {
          window.location.reload(); // รีเฟรชหน้า
        }, 1000);
      };

  const handleSubmitContent = async () => {
        try {
            // สมมติว่าเรามีตัวแปร courseID ที่เก็บ ID ของวิชา
            const response = await CreateContent(ContentData);
            if (response.status === 200 && response.data) {
                 message.success('บทเรียนถูกสร้างสำเร็จ!');
                // สามารถรีเซ็ตฟอร์มหรือจัดการกับข้อมูลที่ได้รับที่นี่
                handleRefresh();
                console.log(response.data)
              } 
        } catch (error) {
          console.error('Error creating lesson:', error);
        }
      };

  const [UrlData, setUrlData] = useState<CourseUrlInterface>({
        Title: "",
        Url: "",
        Status: "hide",
        LessonID: LessonID, 
      });

  const handleSubmitVideo = async () => {
        try {
            // สมมติว่าเรามีตัวแปร courseID ที่เก็บ ID ของวิชา
            const response = await CreateVideo(UrlData);
            if (!UrlData.Title?.trim()) {
              message.warning('กรุณากรอกชื่อลิ้งค์');  // แจ้งเตือนหากไม่ได้กรอกชื่อบทเรียน
              return;
            } else if (!UrlData.Url?.trim()){
              message.warning('กรุณากรอกลิ้งค์');  // แจ้งเตือนหากไม่ได้กรอกชื่อบทเรียน
              return;
            }
            if (response.status === 200 && response.data) {
                message.success('สร้างสำเร็จ!');
                // สามารถรีเซ็ตฟอร์มหรือจัดการกับข้อมูลที่ได้รับที่นี่
                handleRefresh();
                console.log(response.data)
              } 
        } catch (error) {
          console.error('Error creating lesson:', error);
        }
      };


  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;

        if (name in ContentData) {
          setContentData({ ...ContentData, [name]: value });
        } else if (name in UrlData) {
          setUrlData(prevState => ({
            ...prevState,
            [name]: value,
          }));
        }else if (name in MaterialData) {
          setMaterialData({ ...MaterialData, [name]: value });
        }
      };


  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModalContent = () => {
    setOpenModalContent(true);
    handleClose();
  };

  const handleOpenModalLink = () => {
    setOpenModalLink(true);
    handleClose();
  };

  const handleOpenModalFile = () => {
    setOpenModalFile(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModalContent(false);
    setOpenModalLink(false);
    setOpenModalFile(false);
  };

  interface MaterialInterface {
    MaterialName: string;
    FilePath?: File;
    Status?: string;
    LessonID: number;
  }
  
  const [MaterialData, setMaterialData] = useState<MaterialInterface>({
    MaterialName: "",
    FilePath: undefined,
    Status: "hide",
    LessonID: LessonID,
  });
  
  const [fileName, setFileName] = useState<string | null>(null);
  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > MAX_FILE_SIZE) {
        message.success("ไฟล์มีขนาดใหญ่เกินไป! กรุณาอัพโหลดไฟล์ที่มีขนาดไม่เกิน 15MB");
      } else {
      setMaterialData((prevData) => ({
        ...prevData,
        FilePath: file,
      }));
      setFileName(file.name);
      }
    } else{
      message.warning('กรุณาเลือกไฟล์ PDF เท่านั้น');
    }
  };
  
  const handleSubmitMaterial = async () => {
    try {
      const formData = new FormData();
      formData.append("MaterialName", MaterialData.MaterialName || "");
      formData.append("FilePath", MaterialData.FilePath as File);
      formData.append("LessonID", String(MaterialData.LessonID));
      console.log(formData);
      const response = await CreateMaterial(formData);
  
      // ตรวจสอบว่า response เป็น AxiosResponse หรือไม่
      if (response && 'status' in response) {
        // ตรวจสอบว่า response เป็น AxiosResponse จริงๆ
        if (response.status === 200 && response.data) {
          message.success('ไฟล์ถูกสร้างสำเร็จ!');
          handleRefresh();
          console.log(response.data);
        }
      } else {
        // กรณีที่ response เป็นออบเจ็กต์ที่มีฟิลด์ error
        message.error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์');
      }
    } catch (error) {
      console.error('Error creating material:', error);
      message.error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์');
    }
  };
  
  

  
  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Options
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenModalContent} disableRipple>
          <EditIcon />
          เนื้อหา
        </MenuItem>
        <MenuItem onClick={handleOpenModalLink} disableRipple>
          <AttachFileIcon color='action'/>
          ลิ้งวิดีโอ
        </MenuItem>
        <MenuItem onClick={handleOpenModalFile} disableRipple>
          <UploadFileIcon color='action'/>
           ไฟล์เอกสาร
        </MenuItem>
      </StyledMenu>

      {/* Modal for Content */}
      <Modal open={openModalContent} onClose={handleCloseModal}>
        <ModalDialog>
          <h2>เนื้อหา</h2>
          <DialogContent>กรอกข้อมูลเนื้อหาที่ต้องการสร้าง</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleCloseModal(); // ปิด Modal เมื่อกด Submit
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>ชื่อเนื้อหา</FormLabel>
                <Input 
                  name="Title"
                  value={ContentData.Title}
                  onChange={handleInputChange}
                  placeholder="กรอกชื่อเนื้อหา"
                  autoFocus
                    />
              </FormControl>
              <FormControl>
                <FormLabel>รายละเอียด</FormLabel>
                <TextField 
                  name="Content"
                  value={ContentData.Content}
                  onChange={handleInputChange}
                  placeholder="กรอกรายละเอียด..." 
                  multiline
                  minRows={4} // กำหนดจำนวนบรรทัดเริ่มต้น
                  maxRows={6}
                  />
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" onClick={handleSubmitContent} color="success" sx={{ border: "2px solid green" }}>เสร็จสิ้น</Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Modal for Link */}
      <Modal open={openModalLink} onClose={handleCloseModal}>
        <ModalDialog>
          <h2>ลิ้งค์เนื้อหา</h2>
          <DialogContent>กรอกลิ้งค์ที่ต้องการ</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleCloseModal(); // ปิด Modal เมื่อกด Submit
            }}
          >
            <Stack spacing={2}>
            <FormControl>
                <FormLabel>ชื่อเนื้อหา</FormLabel>
                <Input
                  required 
                  name="Title"
                  value={UrlData.Title}
                  onChange={(e) => {
                    console.log("Changing Title to:", e.target.value);
                    setUrlData({ ...UrlData, Title: e.target.value });
                  }}
                  autoFocus  />
              </FormControl>
              <FormControl>
                <FormLabel>ลิ้งค์</FormLabel>
                <Input 
                  required
                  name="Url"
                  value={UrlData.Url}
                  onChange={handleInputChange}
                   />
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" onClick={handleSubmitVideo} color="success" sx={{ border: "2px solid green" }}>
                  เสร็จสิ้น
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Modal for File */}
      <Modal open={openModalFile} onClose={handleCloseModal}>
        <ModalDialog>
          <h2>ไฟล์เอกสาร</h2>
          <DialogContent>กรอกข้อมูลไฟล์เอกสารที่ต้องการอัพโหลด</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (!MaterialData.MaterialName || !MaterialData.FilePath) {
                message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
              }
              handleCloseModal();
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>ชื่อไฟล์</FormLabel>
                <Input
                  required 
                  name="MaterialName"
                  value={MaterialData.MaterialName}
                  onChange={(e) =>
                    setMaterialData({ ...MaterialData, MaterialName: e.target.value })
                  }
                  autoFocus
                />
              </FormControl>
              <FormControl>
                <FormLabel>File</FormLabel>
                <Button variant="contained" component="label" fullWidth >
                  เลือกไฟล์
                  <input type="file" hidden onChange={handleFileChange}  name="FilePath" />
                </Button>
                {fileName && (
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    <strong>ไฟล์ที่เลือก:</strong> {fileName}
                  </Typography>
                )}
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" onClick={handleSubmitMaterial} color="success" sx={{ border: "2px solid green" }}>
                  เสร็จสิ้น
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
}