import * as React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha, Menu, MenuProps } from '@mui/material';
import CreateAssign from '../../Assignment/CreateAssign';

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
    color: theme.palette.text.primary,
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
  LessonID: number;
}

export const CustomizedMenusCreateAssignment: React.FC<OptionProps> = ({ LessonID }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // State สำหรับควบคุม Popup
  const [isCreateAssignOpen, setCreateAssignOpen] = React.useState(false);

  // ฟังก์ชันสำหรับเปิด/ปิด Popup
  const openCreateAssign = () => setCreateAssignOpen(true);
  const closeCreateAssign = () => setCreateAssignOpen(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        OPTION
      </Button>
      <StyledMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* สร้างการบ้าน */}
        <MenuItem
          onClick={() => {
            handleClose();
            openCreateAssign();
          }}
        >
          สร้างการบ้าน
        </MenuItem>
        {/* สร้างแบบทดสอบ */}
        <MenuItem
          onClick={() => {
            handleClose();
            console.log('เปิดฟอร์มสร้างแบบทดสอบ');
          }}
        >
          สร้างแบบทดสอบ
        </MenuItem>
      </StyledMenu>

      {/* Popup สำหรับ CreateAssign */}
      {isCreateAssignOpen && (
        <CreateAssign
          isOpen={isCreateAssignOpen}
          onClose={closeCreateAssign}
          courseId={LessonID}
        />
      )}
    </div>
  );
};