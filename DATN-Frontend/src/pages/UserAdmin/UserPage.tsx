import { Dashboard } from "@mui/icons-material";
import DashBoardLayout from "../../components/layout/Dashboard/LayoutDB";
import { useEffect, useState } from "react";
import { customFetch } from "../../features/customFetch";
import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  provider?: string;
  refeshToken?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
};

const UserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const fetchUser = async () => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });
    if (name) query.set("name", name);
    if (id) query.set("id", id);
    const response = await customFetch(
      `http://localhost:3000/api/auth/getUser/?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setUser(data.data);
      setTotalPages(data.total);
    } else {
      console.error("Failed to fetch users");
    }
  };
  console.log(user);
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const nameParam = searchParams.get("name");
    const idParam = searchParams.get("id");

    setPage(pageParam ? parseInt(pageParam) : 1);
    setName(nameParam || "");
    setId(idParam || "");
  }, [searchParams]);

  useEffect(() => {
    fetchUser();
  }, [searchParams]);

  //Lọc

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", value.toString());
      return newParams;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("name", newName);
      newParams.set("page", "1");
      return newParams;
    });
  };
  return (
    <DashBoardLayout>
      <h1>Trang quản lý người dùng</h1>
      <div className="my-4">
        <TextField
          label="Tìm kiếm theo tên người dùng"
          variant="outlined"
          value={name}
          type="search"
          onChange={handleSearchChange}
        ></TextField>
      </div>
      {/* Nội dung trang quản lý người dùng sẽ được thêm vào đây */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={1}>ID</TableCell>
              <TableCell colSpan={1}>Họ và Tên</TableCell>
              <TableCell colSpan={2}>Email</TableCell>
              <TableCell colSpan={1}>Provider</TableCell>
              <TableCell colSpan={1}>Địa chỉ</TableCell>
              <TableCell colSpan={1}>Số điện thoại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user &&
              user.map((item) => (
                <TableRow key={item.id}>
                  <TableCell colSpan={1}>{item.id}</TableCell>
                  <TableCell colSpan={1}>
                    {item.lastName + " " + item.firstName}
                  </TableCell>
                  <TableCell colSpan={2}>{item.email}</TableCell>
                  <TableCell colSpan={1}>{item.provider}</TableCell>
                  <TableCell colSpan={1}>{item.address}</TableCell>
                  <TableCell colSpan={1}>{item.phoneNumber}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(totalPages / 10)}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </DashBoardLayout>
  );
};

export default UserPage;
