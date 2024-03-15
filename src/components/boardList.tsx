import React, { useState } from "react";
import faker from "faker/locale/ko";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper, Button, TextField, Modal, Fade, Box } from "@material-ui/core";
import styled from "styled-components";

faker.seed(123);

const HeaderBox = styled.div`
   display: flex;
   height: 100px;
   justify-content: center;
   align-items: center;
   padding: 0 20px;
`;

const modalStyle = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 400,
   bgcolor: "background.paper",
   border: "2px solid #000",
   textAlign: "center",
   boxShadow: 24,
   p: 4,
};

interface User {
   id: string;
   name: string;
   email: string;
   phone: string;
   updatedAt?: string;
}

const generateInitialUsers = () =>
   Array.from({ length: 10 }, () => ({
      id: faker.random.uuid(),
      name: faker.name.lastName() + faker.name.firstName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      updatedAt: null || undefined,
   }));

const BoardList = () => {
   const [users, setUsers] = useState<User[]>(generateInitialUsers());
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [formUser, setFormUser] = useState<User>({ id: "", name: "", email: "", phone: "" });
   const [editMode, setEditMode] = useState(false); // update인지 create인지 구분

   const openModalForAdd = () => {
      setFormUser({ id: "", name: "", email: "", phone: "" }); // 폼 초기화
      setEditMode(false);
      setIsModalOpen(true);
   };

   const openModalForUpdate = (user: User) => {
      setFormUser(user);
      setEditMode(true);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormUser((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = () => {
      const currentTime = new Date().toLocaleString();

      if (!formUser.name || !formUser.email || !formUser.phone) {
         alert("모든 필드를 입력해주세요.");
         return;
      }

      if (editMode) {
         setUsers(users.map((user) => (user.id === formUser.id ? { ...formUser, updatedAt: currentTime } : user))); // update
      } else {
         setUsers([...users, { ...formUser, id: faker.random.uuid() }]); // create
      }
      closeModal();
   };

   const handleDeleteUser = (id: string) => {
      setUsers(users.filter((user) => user.id !== id)); // delate
   };

   return (
      <TableContainer component={Paper}>
         <HeaderBox>
            <Button variant="contained" color="primary" onClick={openModalForAdd}>
               Add User
            </Button>
         </HeaderBox>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">이메일</TableCell>
                  <TableCell align="center">휴대폰번호</TableCell>
                  <TableCell align="center">동작</TableCell>
                  <TableCell align="center">수정시간</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {users.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((user, index) => (
                  <TableRow key={user.id}>
                     <TableCell component="th" scope="row">
                        {page * rowsPerPage + index + 1}
                     </TableCell>
                     <TableCell align="center">{user.name}</TableCell>
                     <TableCell align="center">{user.email}</TableCell>
                     <TableCell align="center">{user.phone}</TableCell>
                     <TableCell align="center">
                        <Button variant="contained" color="default" style={{ marginRight: "10px" }} onClick={() => openModalForUpdate(user)}>
                           Update
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id)}>
                           Delete
                        </Button>
                     </TableCell>
                     <TableCell align="center">{user.updatedAt || "X"}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
            <TableFooter>
               <TableRow>
                  <TablePagination count={users.length} page={page} rowsPerPage={rowsPerPage} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
               </TableRow>
            </TableFooter>
         </Table>
         <Modal open={isModalOpen} onClose={closeModal}>
            <Fade in={isModalOpen}>
               <Box sx={modalStyle}>
                  <TextField label="Name" name="name" value={formUser.name} style={{ width: "100%" }} onChange={handleFormChange} />
                  <TextField label="Email" name="email" value={formUser.email} style={{ width: "100%" }} onChange={handleFormChange} />
                  <TextField label="Phone" name="phone" value={formUser.phone} style={{ width: "100%" }} onChange={handleFormChange} />
                  <Button variant="contained" color="primary" style={{ width: "80px", marginTop: "20px" }} onClick={handleSubmit}>
                     {editMode ? "Update" : "Add"}
                  </Button>
               </Box>
            </Fade>
         </Modal>
      </TableContainer>
   );
};

export default BoardList;
