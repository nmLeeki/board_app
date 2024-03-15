import React, { useState } from "react";
import faker from "faker/locale/ko";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper, Button, TextField, Modal, Fade, Box } from "@material-ui/core";
import styled from "styled-components";

const HeaderBox = styled.div`
   display: flex;
   height: 100px;
   justify-content: center;
   align-items: center;
   padding: 0 20px;
`;

const style = {
   position: "absolute" as "absolute",
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

faker.seed(123);

interface User {
   id: string;
   name: string;
   email: string;
   phone: string;
}

const BoardList: React.FC = () => {
   const [users, setUsers] = useState<User[]>(
      Array(10)
         .fill(null)
         .map(() => ({
            id: faker.random.uuid(),
            name: faker.name.lastName() + faker.name.firstName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
         }))
   );
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [newUser, setNewUser] = useState<User>({
      id: "",
      name: "",
      email: "",
      phone: "",
   });
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isUpdate, setisUpdate] = useState(false);
   const [selectedUserId, setSelectedUserId] = useState("");

   // 모달창 열기/닫기 함수
   const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
   };

   const toggleModalUpdate = (userId: string) => {
      const selectedUser = users.find((user) => user.id === userId);
      setIsModalOpen(!isModalOpen);
      setisUpdate(!isUpdate);
      if (selectedUser) {
         setSelectedUserId(selectedUser.id);
      }
   };

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
   };
   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
      setNewUser({
         ...newUser,
         [field]: e.target.value,
      });
   };

   const handleAddUser = () => {
      const newUserWithId: User = {
         ...newUser,
         id: Math.random().toString(36).substr(2, 9),
      };
      if (newUser.name == "" || newUser.email == "" || newUser.phone == "") {
         alert("데이터를 입력해주세요.");
      } else {
         setUsers([...users, newUserWithId]);
         setNewUser({
            id: "",
            name: "",
            email: "",
            phone: "",
         });
         toggleModal();
      }
   };

   // const handleUpdateUser = () => {
   //    if (newUser.name === "" || newUser.email === "" || newUser.phone === "") {
   //       alert("데이터를 입력해주세요.");
   //    } else {
   //       handleEditUser;
   //    }
   // };
   const handleDeleteUser = (id: string) => {
      const deleteUsers = users.filter((user) => user.id !== id);
      setUsers(deleteUsers);
   };

   const handleEditUser = (userId: string) => {
      if (newUser.name == "" || newUser.email == "" || newUser.phone == "") {
         alert("데이터를 입력해주세요.");
      } else {
         // setNewUser([...users,selectedUserId]);
         toggleModal();
      }
   };

   return (
      <TableContainer component={Paper}>
         <HeaderBox>
            <Button variant="contained" color="secondary" onClick={toggleModal}>
               Add User
            </Button>
         </HeaderBox>
         <Table size="medium">
            <TableHead>
               <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Actions</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {users.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(({ id, name, email, phone }, i) => (
                  <TableRow key={id}>
                     <TableCell component="th" scope="row">
                        {page * rowsPerPage + i + 1}
                     </TableCell>
                     <TableCell align="center">{name}</TableCell>
                     <TableCell align="center">{email}</TableCell>
                     <TableCell align="center">{phone}</TableCell>
                     <TableCell align="center">
                        <Button variant="contained" color="default" style={{ marginRight: "10px" }} onClick={toggleModalUpdate}>
                           Update
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => handleDeleteUser(id)}>
                           Delete
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
            <TableFooter>
               <TableRow>
                  <TablePagination count={users.length} page={page} rowsPerPage={rowsPerPage} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
               </TableRow>
            </TableFooter>
         </Table>
         <Modal open={isModalOpen} onClose={toggleModal}>
            <Fade in={isModalOpen}>
               <Box sx={style}>
                  <TextField label="Name" value={newUser.name} style={{ width: "100%" }} onChange={(e) => handleChange(e, "name")} />
                  <TextField label="Email" value={newUser.email} style={{ width: "100%" }} onChange={(e) => handleChange(e, "email")} />
                  <TextField label="Phone" value={newUser.phone} style={{ width: "100%" }} onChange={(e) => handleChange(e, "phone")} />
                  {isUpdate == true ? (
                     <Button variant="contained" color="primary" style={{ width: "80px", marginTop: "20px" }}>
                        Update
                     </Button>
                  ) : (
                     <Button variant="contained" color="primary" style={{ width: "50px", marginTop: "20px" }} onClick={handleAddUser}>
                        Add
                     </Button>
                  )}
               </Box>
            </Fade>
         </Modal>
      </TableContainer>
   );
};

export default BoardList;
