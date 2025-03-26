import { create } from "zustand";
import axios from "axios";
import { RoleTypes, UserRoleTypes, RolesApiResponse } from "@/types/Role";
import { GET_ROLE_API, GET_ALL_ROLES_API, GET_USER_ROLE_API, GET_ALL_USER_ROLES_API } from "@/app/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useStatusStore } from "@/store/useStatusStore";

interface useRoleState {
  role: RoleTypes | null;
  roles: RoleTypes[] | null;
  allRoles: RoleTypes[] | null;
  userRole: UserRoleTypes | null;
  userRoles: UserRoleTypes[] | null;
  userRolesMap: Record<number, UserRoleTypes[]>; // Map untuk menyimpan roles berdasarkan user ID
  fetchRole: (id: number) => Promise<void>;
  fetchRoles: (ids: number[]) => Promise<void>;
  fetchAllRoles: () => Promise<void>;
  fetchUserRole: (userId: number) => Promise<void>;
  fetchUsersRoles: (userIds: number[]) => Promise<void>; // Fetch banyak user sekaligus
  fetchAllUserRoles: () => Promise<void>;
  resetRoles: () => void;
}

export const useRoleStore = create<useRoleState>((set) => ({
  role: null,
  roles: null,
  allRoles: null,
  userRole: null,
  userRoles: null,
  userRolesMap: {},

  resetRoles: () => {
    set({ role: null, roles: null, userRole: null, allRoles: null, userRoles: null, userRolesMap: {} });
    useStatusStore.getState().setLoading(false);
    useStatusStore.getState().setError(null);
  },

  fetchRole: async (id: number) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const response = await axios.get<RolesApiResponse<RoleTypes>>(`${GET_ROLE_API}/${id}`);
      set({ role: response.data.data });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed Fetching Role";
      setError(errorMessage);
    }
  },

  fetchRoles: async (ids: number[]) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const responses = await Promise.all(
        ids.map(id => axios.get<RolesApiResponse<RoleTypes>>(`${GET_ROLE_API}/${id}`))
      );
      const roles = responses.map(res => res.data.data);
      set({ roles });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages
        ? error.response.data.messages
        : "Failed Fetching Roles";
      setError(errorMessage);
    }
  },

  fetchAllRoles: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const response = await axios.get<RolesApiResponse<RoleTypes[]>>(GET_ALL_ROLES_API);
      set({ allRoles: response.data.data });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed Fetching All Roles";
      setError(errorMessage);
    }
  },

  fetchUserRole: async (userId: number) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.get<RolesApiResponse<UserRoleTypes[]>>(`${GET_USER_ROLE_API}/${userId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data.data.length === 1) {
        set({ userRole: response.data.data[0] });
      } else {
        set({ userRoles: response.data.data });
      }
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed Fetching User Role";
      setError(errorMessage);
    }
  },

  fetchUsersRoles: async (userIds: number[]) => {
      const { setError } = useStatusStore.getState();
      setError(null);
      const token = useAuthStore.getState().token;
      try {
          const responses = await Promise.all(
              userIds.map((userId) =>
                  axios.get<RolesApiResponse<UserRoleTypes[]>>(`${GET_USER_ROLE_API}/${userId}`, {
                      headers: { Authorization: `Token ${token}` },
                  })
              )
          );
          const rolesMap: Record<number, UserRoleTypes[]> = {};
          const roleIds = new Set<number>();
          responses.forEach((response, index) => {
              const userId = userIds[index];
              rolesMap[userId] = response.data.data;
              response.data.data.forEach(userRole => {
                  roleIds.add(userRole.role);
              });
          });
          const roleResponses = await Promise.all(
              Array.from(roleIds).map((roleId) =>
                  axios.get<RolesApiResponse<RoleTypes>>(`${GET_ROLE_API}/${roleId}`, {
                      headers: { Authorization: `Token ${token}` },
                  })
              )
          );
          const roleData: RoleTypes[] = roleResponses.map(res => res.data.data);
          set({ userRolesMap: rolesMap, roles: roleData });
      } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages
              ? error.response.data.messages
              : "Failed Fetching User Roles";
          setError(errorMessage);
      }
  },


  fetchAllUserRoles: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.get<RolesApiResponse<UserRoleTypes[]>>(GET_ALL_USER_ROLES_API, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ userRoles: response.data.data });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed Fetching All User Roles";
      setError(errorMessage);
    }
  },
}));
