import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

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

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModalContent, setOpenModalContent] = React.useState<boolean>(false);
  const [openModalLink, setOpenModalLink] = React.useState<boolean>(false);
  const [openModalFile, setOpenModalFile] = React.useState<boolean>(false);

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
          <FileCopyIcon />
          ลิ้งวิดีโอ
        </MenuItem>
        <MenuItem onClick={handleOpenModalFile} disableRipple>
          <ArchiveIcon />
          ไฟล์เอกสาร
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          More
        </MenuItem>
      </StyledMenu>

      {/* Modal for Content */}
      <Modal open={openModalContent} onClose={handleCloseModal}>
        <ModalDialog>
          <DialogTitle>เนื้อหา</DialogTitle>
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
                <Input autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>รายละเอียด</FormLabel>
                <Input required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Modal for Link */}
      <Modal open={openModalLink} onClose={handleCloseModal}>
        <ModalDialog>
          <DialogTitle>ลิ้งค์วิดีโอ</DialogTitle>
          <DialogContent>กรอกลิ้งค์วิดีโอที่ต้องการ</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleCloseModal(); // ปิด Modal เมื่อกด Submit
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>ลิ้งค์วิดีโอ</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Modal for File */}
      <Modal open={openModalFile} onClose={handleCloseModal}>
        <ModalDialog>
          <DialogTitle>ไฟล์เอกสาร</DialogTitle>
          <DialogContent>กรอกข้อมูลไฟล์เอกสารที่ต้องการอัพโหลด</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleCloseModal(); // ปิด Modal เมื่อกด Submit
            }}
          >
    
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>ชื่อไฟล์</FormLabel>
                <Input autoFocus required />
              </FormControl>
                  <Button
              variant="contained"
              component="label"
            >
              Upload File
              <input
                type="file"
                hidden
                accept=".pdf"
              />
            </Button>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
}
