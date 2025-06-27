import { TextField } from "@mui/material";
import LayoutClient from "../../components/layout/Client/LayoutClient";

import SidebarClient from "../../components/ui/SidebarClient";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEffect, useState } from "react";
import EditProfileDialog from "./EditProflie";
import { updateProfileAPI } from "../../redux/api";
import { toast } from "react-toastify";
import { setUser } from "../../redux/slice/authSlice";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log("user", user);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdateSubmit = async (data: any) => {
    console.log("Form submitted with:", data);
    const res = await updateProfileAPI(data);
    const responseData = await res.json();
    if (res.status === 200) {
      dispatch(setUser(responseData.data));
      toast.success(responseData.message);
      console.log("Cập nhật thành công");
    } else {
      console.log("Cập nhật thất bại");
    }
    setOpen(false);
  };

  

  return (
    <LayoutClient>
      <div className="grid grid-cols-12 gap-4 md:px-32 md:py-4">
        <div className="col-span-3 rounded">
          <SidebarClient />
        </div>
        <div className="col-span-9 p-2 rounded border border-gray-300">
          <div className="flex justify-center border-b-2 border-gray-300 p-4">
            <p className="font-bold text-xl">Thông tin cá nhân</p>
          </div>
          <div className="grid grid-cols-9 mt-4 space-x-4">
            <div className="col-span-3 p-4 rounded bg-gray-100 h-96">
              <div>Ảnh đại diện</div>
              <div className="flex justify-center items-center h-full flex-col space-y-4">
                <img alt="Avatar" src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/8-anh-dai-dien-trang-inkythuatso-03-15-26-54.jpg" className="w-60 h-60 rounded-full" />
                <div>Sửa ảnh</div>
              </div>
            </div>

            <div className="col-span-6 p-4 ">
              <div className="flex space-x-4">
                <div className="flex w-1/2 flex-col space-y-8 ">
                  <div>
                    <TextField
                      className="w-full mt-4"
                      id="outlined-read-only-input"
                      label="Id"
                      value={user?.id}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      className="w-full mt-4"
                      id="outlined-read-only-input"
                      label="First Name"
                      value={user?.firstName}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      className="w-full mt-4"
                      id="outlined-read-only-input"
                      label="Last Name"
                      value={user?.lastName}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-1/2 flex-col space-y-8">
                  <div>
                    <TextField
                      className="w-full"
                      id="outlined-read-only-input"
                      label="Read Only"
                      value={user?.email}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      className="w-full"
                      id="outlined-read-only-input"
                      label="Số điện thoại"
                      value={user?.phoneNumber || "Chưa cập nhật"}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      className="w-full"
                      id="outlined-read-only-input"
                      label="Địa chỉ"
                      value={user?.address || "Chưa cập nhật"}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      className="w-full"
                      id="outlined-read-only-input"
                      label="Vai trò"
                      value={user?.role || "Chưa cập nhật"}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <EditProfileDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleUpdateSubmit}
          defaultValues={{
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            address: user?.address || "",
          }}
        />
      </div>
    </LayoutClient>
  );
};

export default Profile;
