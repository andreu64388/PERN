import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface IUser {
  user: any;
  auth: boolean;
  loading: boolean;
  message: string;
  token: string | null;
}

const initialState: IUser = {
  user: null,
  auth: false,
  loading: false,
  message: "",
  token: null,
};

export const RegisterUser = createAsyncThunk(
  "auth/register",
  async (formData: any) => {
    try {
      console.log(formData);
      const onUploudsProgress = (progressEvent: any) => {
        console.log(
          "Upload Progress: " +
            Math.round((progressEvent.loaded * 100) / progressEvent.total) +
            "%"
        );
      };
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: onUploudsProgress,
      };
      console.log(formData);
      const { data } = await axios.post("/auth/register", formData, config);
      console.log(data);

      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const LoginUser = createAsyncThunk(
  "auth/login",
  async ({ name, password }: { name: string; password: string }) => {
    try {
      const { data } = await axios.post("/auth/login", {
        name: name,
        password: password,
      });
      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const GetMe = createAsyncThunk("auth/getme", async () => {
  try {
    const { data } = await axios.get("/auth/getme");

    return data;
  } catch (error) {
    console.log(error);
  }
});
export const UpdateName = createAsyncThunk(
  "/auth/updatename",
  async ({ id, surname }: { id: number; surname: string }) => {
    try {
      const { data } = await axios.put("/auth/updatename", {
        id_person: id,
        surname: surname,
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const UpdatePassword = createAsyncThunk(
  "/auth/updatepassword",
  async ({
    id,
    password,
    newPassword,
  }: {
    id: number;
    password: string;
    newPassword: string;
  }) => {
    try {
      const { data } = await axios.put("/auth/updatepasword", {
        id_person: id,
        password: password,
        newPassword: newPassword,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const DeleteUser = createAsyncThunk(
  "/auth/deleteuser",
  async ({ id }: { id: number }) => {
    try {
      const { data } = await axios.delete("/auth/deleteuser", {
        data: {
          id_person: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const GetUsers = createAsyncThunk("/auth/getusers", async () => {
  try {
    const { data } = await axios.get("/auth/getusers");
    return data;
  } catch (error) {
    console.log(error);
  }
});
export const UpdateImage = createAsyncThunk(
  "/auth/updateimage",
  async (datas: any) => {
    try {
      const onUploudsProgress = (progressEvent: any) => {
        console.log(
          "Upload Progress: " +
            Math.round((progressEvent.loaded * 100) / progressEvent.total) +
            "%"
        );
      };
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: onUploudsProgress,
      };
      const { data } = await axios.put("/auth/updateimage", datas, config);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const authSlice:any = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LogoutUser: (state) => {
      state.user = null;
      state.auth = false;
      state.loading = false;
      state.message = "";
      state.token = null;
      window.localStorage.removeItem("token");
    },
    DeleteMessage: (state) => {
      state.message = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RegisterUser.fulfilled, (state: any, action: any) => {
      state.user = action.payload?.user;
      state.auth = true;
      state.loading = false;
      state.message = action.payload?.message;
      state.token = action.payload?.token;
    });
    builder.addCase(RegisterUser.pending, (state: any, action: any) => {
      state.loading = true;
    });
    builder.addCase(RegisterUser.rejected, (state: any, action: any) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(LoginUser.fulfilled, (state: any, action: any) => {
      state.user = action.payload?.user;
      state.auth = true;
      state.loading = false;
      state.message = action.payload?.message;
      state.token = action.payload?.token;
    });
    builder.addCase(LoginUser.pending, (state: any, action: any) => {
      state.loading = true;
    });
    builder.addCase(LoginUser.rejected, (state: any, action: any) => {
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(GetMe.fulfilled, (state: any, action: any) => {
      state.user = action.payload?.user;
      state.auth = true;
      state.loading = false;
      state.message = action.payload?.message;
      state.token = action.payload?.token;
    });
    builder.addCase(GetMe.rejected, (state: any, action: any) => {
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(GetMe.pending, (state: any) => {
      state.loading = true;
      state.message = "";
    });
    builder.addCase(UpdateName.fulfilled, (state: any, action: any) => {
      state.user = action.payload?.user;
      state.auth = true;
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(UpdateName.rejected, (state: any, action: any) => {
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(UpdateName.pending, (state: any) => {
      state.loading = true;
      state.message = "";
    });
    builder.addCase(UpdatePassword.fulfilled, (state: any, action: any) => {
      state.user = action.payload?.user;
      state.auth = true;
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(UpdatePassword.rejected, (state: any, action: any) => {
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(UpdatePassword.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(DeleteUser.fulfilled, (state: any, action: any) => {
      state.message = action.payload?.message;
    });
    builder.addCase(DeleteUser.rejected, (state: any) => {
      state.loading = false;
      state.message = "";
    });
    builder.addCase(DeleteUser.pending, (state: any) => {
      state.loading = true;
      state.message = "";
    });
    builder.addCase(GetUsers.fulfilled, (state: any, action: any) => {
      state.users = action.payload;
      state.loading = false;
      state.message = action.payload?.message;
    });
    builder.addCase(GetUsers.rejected, (state: any) => {
      state.loading = false;
      state.message = "";
    });
  },
});
export const CheckIsAuth = (state: any) => Boolean(state.auth.token);
export const { LogoutUser, DeleteMessage } = authSlice.actions;
export default authSlice.reducer;
